#!/usr/bin/env node
/**
 * Скачивает фото → WebP (sharp) → Vercel Blob → MongoDB
 *
 * node --env-file=.env.local scripts/upload-blob-images.mjs
 * node --env-file=.env.local scripts/upload-blob-images.mjs --dry-run
 * node --env-file=.env.local scripts/upload-blob-images.mjs --categories-only
 * node --env-file=.env.local scripts/upload-blob-images.mjs --limit=20
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { put, head } from "@vercel/blob";
import { MongoClient } from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const categoriesDir = join(ROOT, "public/images/categories");
const blobPathsOut = join(ROOT, "src/entities/product/model/category-blob-paths.json");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "mediavitamins";
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const categoriesOnly = args.includes("--categories-only");
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : Infinity;

const PRODUCT_MAX = 800;
const CATEGORY_MAX = 640;
const WEBP_QUALITY = 75;
const CONCURRENCY = 5;

if (!uri && !dryRun) {
  console.error("Задайте MONGODB_URI");
  process.exit(1);
}
if (!blobToken && !dryRun) {
  console.error("Задайте BLOB_READ_WRITE_TOKEN (Vercel → Storage → mediavitamins-blob → Connect to Project)");
  process.exit(1);
}

let totalOriginal = 0;
let totalWebp = 0;
let uploaded = 0;
let skipped = 0;

async function fetchImage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "MediVitamins-Blob/1.0" },
    signal: AbortSignal.timeout(45_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function toWebp(buffer, maxSize) {
  return sharp(buffer)
    .rotate()
    .resize({
      width: maxSize,
      height: maxSize,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4, smartSubsample: true })
    .toBuffer();
}

async function blobExists(pathname) {
  if (!blobToken) return false;
  try {
    await head(pathname, { token: blobToken });
    return true;
  } catch {
    return false;
  }
}

async function uploadWebp(pathname, webp) {
  if (dryRun) return { pathname };
  return put(pathname, webp, {
    access: "private",
    contentType: "image/webp",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: blobToken,
  });
}

async function mapPool(items, fn, poolSize) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: poolSize }, worker));
  return results;
}

function byteSize(value) {
  return typeof value === "number" ? value : value?.length ?? 0;
}

function formatKb(bytes) {
  return `${(byteSize(bytes) / 1024).toFixed(1)} KB`;
}

async function processCategoryFromWebp(id, webp, db) {
  const pathname = `categories/${id}.webp`;

  if (!dryRun && (await blobExists(pathname))) {
    skipped++;
    return pathname;
  }

  totalWebp += webp.length;
  console.log(`  ${id}: ${formatKb(webp)} webp`);

  await uploadWebp(pathname, webp);

  if (db && !dryRun) {
    await db.collection("category_images").updateOne(
      { id },
      {
        $set: {
          id,
          pathname,
          format: "webp",
          bytes: webp.length,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
  }

  uploaded++;
  return pathname;
}

const localProductsDir = join(ROOT, "public/media/products");
const localCategoriesDir = join(ROOT, "public/media/categories");

async function readLocalOrFetch(product) {
  const localFile = join(localProductsDir, `${product.id}.webp`);
  if (existsSync(localFile)) {
    return { buffer: readFileSync(localFile), fromCache: true };
  }
  if (!product.image?.startsWith("http")) {
    throw new Error("нет URL и локального файла");
  }
  return { buffer: await fetchImage(product.image), fromCache: false };
}

async function processProduct(product, db) {
  const pathname = `products/${product.id}.webp`;

  if (product.blobImagePath === pathname && !dryRun) {
    if (await blobExists(pathname)) {
      skipped++;
      return;
    }
  }

  const { buffer: original, fromCache } = await readLocalOrFetch(product);
  const webp = fromCache ? original : await toWebp(original, PRODUCT_MAX);
  totalOriginal += original.length;
  totalWebp += webp.length;

  if (uploaded < 5 || uploaded % 50 === 0) {
    const saved = ((1 - webp.length / original.length) * 100).toFixed(0);
    console.log(
      `  ${product.name.slice(0, 40)}: ${formatKb(original)} → ${formatKb(webp)} (−${saved}%)`,
    );
  }

  await uploadWebp(pathname, webp);

  if (db && !dryRun) {
    await db.collection("products").updateOne(
      { id: product.id },
      {
        $set: {
          blobImagePath: pathname,
          imageOriginal: product.image,
          imageBytes: webp.length,
          updatedAt: new Date(),
        },
      },
    );
  }

  uploaded++;
}

async function uploadCategories(db) {
  if (!existsSync(categoriesDir)) {
    console.log("Папка categories не найдена");
    return {};
  }

  const files = [...new Set(readdirSync(categoriesDir).filter((f) => f.endsWith(".png")))];
  console.log(`\nКатегории: ${files.length} файлов → WebP`);

  const paths = {};
  for (const file of files) {
    const id = file.replace(/\.png$/, "");
    const localWebp = join(localCategoriesDir, `${id}.webp`);
    const buffer = existsSync(localWebp)
      ? readFileSync(localWebp)
      : readFileSync(join(categoriesDir, file));
    const webpBuffer = existsSync(localWebp) ? buffer : await toWebp(buffer, CATEGORY_MAX);
    paths[id] = await processCategoryFromWebp(id, webpBuffer, db);
  }

  if (!dryRun) {
    const blobPaths = Object.fromEntries(
      Object.entries(paths).map(([id, pathname]) => [id, pathname]),
    );
    writeFileSync(blobPathsOut, JSON.stringify(blobPaths, null, 2));
    console.log(`→ ${blobPathsOut}`);
  }

  return paths;
}

async function uploadProducts(db) {
  const col = db.collection("products");
  const query = { image: { $regex: "^https://" } };
  let products = await col.find(query).sort({ name: 1 }).toArray();

  if (Number.isFinite(limit)) products = products.slice(0, limit);

  console.log(`\nТовары: ${products.length} → WebP (max ${PRODUCT_MAX}px, q${WEBP_QUALITY})`);

  await mapPool(
    products,
    async (p) => {
      try {
        await processProduct(p, db);
      } catch (e) {
        console.error(`  ✗ ${p.id}: ${e.message}`);
      }
    },
    CONCURRENCY,
  );
}

const client = uri ? new MongoClient(uri) : null;

try {
  const db = client ? (await client.connect(), client.db(dbName)) : null;

  console.log(dryRun ? "=== DRY RUN (без загрузки) ===" : "=== Загрузка в Vercel Blob ===");

  const categoryPaths = await uploadCategories(db);

  if (!categoriesOnly) {
    await uploadProducts(db);
  }

  const savedPct =
    totalOriginal > 0 ? ((1 - totalWebp / totalOriginal) * 100).toFixed(1) : "0";

  console.log("\n--- Итого ---");
  console.log(`Загружено: ${uploaded}, пропущено (уже в blob): ${skipped}`);
  console.log(`Размер: ${formatKb(totalOriginal)} → ${formatKb(totalWebp)} (−${savedPct}%)`);

  if (dryRun) {
    console.log("\nДля реальной загрузки добавьте BLOB_READ_WRITE_TOKEN в .env.local и уберите --dry-run");
  }
} finally {
  if (client) await client.close();
}
