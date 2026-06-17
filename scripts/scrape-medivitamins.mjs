#!/usr/bin/env node
/**
 * Парсинг каталога с https://www.medivitamins.kz/ (Tilda store sitemap)
 * node scripts/scrape-medivitamins.mjs
 */
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../src/entities/product/model/products.json");
const SITEMAP = "https://www.medivitamins.kz/sitemap-store.xml";
const CONCURRENCY = 6;
const MAX_RETRIES = 4;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function parsePrice(raw) {
  if (!raw) return 0;
  const n = parseInt(raw.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function parseProduct(html, url) {
  const name =
    html.match(/itemprop="name"[^>]*>([^<]+)/)?.[1]?.trim() ||
    html.match(/property="og:title" content="([^"]+)"/)?.[1]?.trim() ||
    "Без названия";

  const image =
    html.match(/property="og:image" content="([^"]+)"/)?.[1] ||
    html.match(/itemprop="image"[^>]*content="([^"]+)"/)?.[1] ||
    "";

  const priceRaw = html.match(/js-store-prod-price-val[^>]*>([^<]+)/)?.[1];
  const oldRaw = html.match(/js-store-prod-price-old-val[^>]*>([^<]+)/)?.[1];
  const price = parsePrice(priceRaw);
  const oldPrice = parsePrice(oldRaw) || undefined;

  const shortDescription =
    html.match(/itemprop="description"[^>]*>([^<]+)/)?.[1]?.trim() || "";

  const pathParts = new URL(url).pathname.split("/").filter(Boolean);
  const catSlug = pathParts[0] === "1" ? "vitaminy" : pathParts[0];
  const tproduct = pathParts.find((p) => p.startsWith("tproduct/")) || "";
  const idPart = tproduct.replace("tproduct/", "").split("-")[0];
  const slugPart = tproduct.replace("tproduct/", "").replace(/^\d+-/, "") || slugify(name);

  const externalId = idPart || slugify(name);
  const slug = `${slugPart}-${externalId}`.slice(0, 100);

  const inStock = !/нет в наличии|sold out/i.test(html);

  return {
    id: externalId,
    slug,
    name,
    categorySlug: catSlug,
    price,
    oldPrice: oldPrice && oldPrice > price ? oldPrice : undefined,
    image,
    shortDescription,
    inStock,
    sourceUrl: url,
  };
}

async function fetchText(url, attempt = 0) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "MediVitamins-Import/1.0" },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.text();
  } catch (e) {
    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      return fetchText(url, attempt + 1);
    }
    throw e;
  }
}

async function mapPool(items, fn, limit) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      try {
        results[idx] = await fn(items[idx], idx);
      } catch (e) {
        console.error("fail", items[idx], e.message);
        results[idx] = null;
      }
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results.filter(Boolean);
}

async function main() {
  console.log("Загрузка sitemap...");
  const xml = await fetchText(SITEMAP);
  const urls = [...xml.matchAll(/<loc>([^<]+tproduct\/[^<]+)<\/loc>/g)].map((m) => m[1]);
  console.log(`Найдено товаров: ${urls.length}`);

  let done = 0;
  const products = await mapPool(
    urls,
    async (url) => {
      const html = await fetchText(url);
      const p = parseProduct(html, url);
      done++;
      if (done % 50 === 0) console.log(`  ${done}/${urls.length}`);
      return p;
    },
    CONCURRENCY,
  );

  products.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(products, null, 2), "utf8");
  console.log(`Сохранено: ${OUT} (${products.length} товаров)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
