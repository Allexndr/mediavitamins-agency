#!/usr/bin/env node
/**
 * Скачивает обложки категорий из фото товаров medivitamins.kz
 * node scripts/fetch-category-images.mjs
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../public/images/categories");
const products = JSON.parse(
  readFileSync(join(__dirname, "../src/entities/product/model/products.json"), "utf8"),
);
const categories = readFileSync(
  join(__dirname, "../src/entities/product/model/categories.ts"),
  "utf8",
);
const ids = [...categories.matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);

mkdirSync(OUT, { recursive: true });

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "User-Agent": "MediVitamins-Import/1.0" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
}

for (const id of ids) {
  const product = products.find((p) => p.categorySlug === id && p.image);
  if (!product?.image) {
    console.warn(`Нет фото для категории: ${id}`);
    continue;
  }
  const ext = extname(new URL(product.image).pathname) || ".jpg";
  const outPath = join(OUT, `${id}${ext === ".png" ? ".png" : ".jpg"}`);
  const pngPath = join(OUT, `${id}.png`);
  try {
    await download(product.image, outPath);
    console.log(`✓ ${id}`);
    if (!outPath.endsWith(".png")) {
      // categories.ts expects .png — symlink via copy with .png name for jpg content
      writeFileSync(pngPath, readFileSync(outPath));
    }
  } catch (e) {
    console.error(`✗ ${id}:`, e.message);
  }
}

console.log("Готово:", OUT);
