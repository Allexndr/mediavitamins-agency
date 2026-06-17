#!/usr/bin/env node
/**
 * Оптимизация фото → WebP в public/media (без Blob)
 * node --env-file=.env.local scripts/optimize-media.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { MongoClient } from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const categoriesDir = join(ROOT, "public/images/categories");
const mediaRoot = join(ROOT, "public/media");
const productsOut = join(mediaRoot, "products");
const categoriesOut = join(mediaRoot, "categories");
const categoryPathsOut = join(ROOT, "src/entities/product/model/category-blob-paths.json");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "mediavitamins";

const PRODUCT_MAX = 800;
const CATEGORY_MAX = 640;
const WEBP_QUALITY = 75;
const CONCURRENCY = 8;

const args = process.argv.slice(2);
const categoriesOnly = args.includes("--categories-only");
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : Infinity;

if (!uri) {
  console.error("Задайте MONGODB_URI");
  process.exit(1);
}

mkdirSync(productsOut, { recursive: true });
mkdirSync(categoriesOut, { recursive: true });

let totalOriginal = 0;
let totalWebp = 0;

async function fetchImage(url, attempt = 0) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "MediVitamins-Media/1.0" },
      signal: AbortSignal.timeout(45_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (e) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      return fetchImage(url, attempt + 1);
    }
    throw e;
  }
}

async function toWebp(buffer, maxSize) {
  return sharp(buffer)
    .rotate()
    .resize({ width: maxSize, height: maxSize, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 4, smartSubsample: true })
    .toBuffer();
}

function formatKb(n) {
  return `${(n / 1024).toFixed(1)} KB`;
}

async function mapPool(items, fn) {
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);

try {
  const categoryPaths = {};

  if (existsSync(categoriesDir)) {
    const files = readdirSync(categoriesDir).filter((f) => f.endsWith(".png"));
    console.log(`Категории: ${files.length} → WebP`);

    for (const file of files) {
      const id = file.replace(/\.png$/, "");
      const src = readFileSync(join(categoriesDir, file));
      const webp = await toWebp(src, CATEGORY_MAX);
      const outFile = join(categoriesOut, `${id}.webp`);
      writeFileSync(outFile, webp);

      const localPath = `/media/categories/${id}.webp`;
      categoryPaths[id] = localPath;
      totalOriginal += src.length;
      totalWebp += webp.length;
      console.log(`  ✓ ${id}: ${formatKb(src.length)} → ${formatKb(webp.length)}`);
    }

    writeFileSync(categoryPathsOut, JSON.stringify(categoryPaths, null, 2));
  }

  if (!categoriesOnly) {
    let cursor = db
      .collection("products")
      .find({ image: { $regex: "^https://" } })
      .sort({ name: 1 });
    if (Number.isFinite(limit)) cursor = cursor.limit(limit);
    const all = await cursor.toArray();

    console.log(`\nТовары: ${all.length} → WebP`);
    let done = 0;

    await mapPool(all, async (p) => {
      const outPath = join(productsOut, `${p.id}.webp`);
      const localPath = `/media/products/${p.id}.webp`;

      if (existsSync(outPath) && p.localImagePath === localPath) {
        done++;
        return;
      }

      try {
        const src = await fetchImage(p.image);
        const webp = await toWebp(src, PRODUCT_MAX);
        writeFileSync(outPath, webp);
        totalOriginal += src.length;
        totalWebp += webp.length;

        await db.collection("products").updateOne(
          { id: p.id },
          {
            $set: {
              localImagePath: localPath,
              imageOriginal: p.image,
              imageBytes: webp.length,
              updatedAt: new Date(),
            },
          },
        );

        done++;
        if (done % 50 === 0) console.log(`  … ${done}/${all.length}`);
      } catch (e) {
        console.error(`  ✗ ${p.id}: ${e.message}`);
      }
    });

    console.log(`  готово: ${done}/${all.length}`);
  }

  const saved =
    totalOriginal > 0 ? ((1 - totalWebp / totalOriginal) * 100).toFixed(1) : "0";
  console.log(`\nИтого: ${formatKb(totalOriginal)} → ${formatKb(totalWebp)} (−${saved}%)`);
} finally {
  await client.close();
}
