#!/usr/bin/env node
/**
 * Импорт каталога в MongoDB + загрузка обложек категорий в Vercel Blob
 * node scripts/seed-mongodb.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import { put } from "@vercel/blob";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const productsPath = join(ROOT, "src/entities/product/model/products.json");
const categoriesDir = join(ROOT, "public/images/categories");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "mediavitamins";
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

if (!uri) {
  console.error("Задайте MONGODB_URI");
  process.exit(1);
}

const products = JSON.parse(readFileSync(productsPath, "utf8"));

function inferGoal(categorySlug, name) {
  const n = name.toLowerCase();
  if (categorySlug === "detskie-vitaminy" || n.includes("детск")) return "kids";
  if (categorySlug === "dlya-pohudeniya") return "weight";
  if (categorySlug.includes("uhod") || categorySlug === "collagen") return "skin";
  if (categorySlug === "uhod-za-volosami") return "hair";
  if (n.includes("пробиот") || n.includes("lacto")) return "gut";
  if (categorySlug === "vitaminy") return "immunity";
  return undefined;
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(dbName);
  const col = db.collection("products");

  await col.createIndex({ id: 1 }, { unique: true });
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ categorySlug: 1 });

  const now = new Date();
  const docs = products.map((p, index) => ({
    ...p,
    goal: inferGoal(p.categorySlug, p.name),
    badge: p.oldPrice && p.oldPrice > p.price ? "sale" : index < 8 ? "hit" : undefined,
    updatedAt: now,
  }));

  const ops = docs.map((doc) => ({
    updateOne: {
      filter: { id: doc.id },
      update: { $set: doc },
      upsert: true,
    },
  }));

  const result = await col.bulkWrite(ops, { ordered: false });
  console.log(
    `MongoDB: ${docs.length} товаров (upserted: ${result.upsertedCount}, modified: ${result.modifiedCount})`,
  );

  const ordersCol = db.collection("orders");
  await ordersCol.createIndex({ orderNumber: 1 }, { unique: true });
  await ordersCol.createIndex({ createdAt: -1 });

  if (blobToken && existsSync(categoriesDir)) {
    const files = readdirSync(categoriesDir).filter((f) => f.endsWith(".png"));
    console.log(`Blob: загрузка ${files.length} обложек категорий...`);

    for (const file of files) {
      const id = file.replace(/\.png$/, "");
      const pathname = `categories/${id}.png`;
      const buffer = readFileSync(join(categoriesDir, file));

      const { url } = await put(pathname, buffer, {
        access: "private",
        contentType: "image/png",
        addRandomSuffix: false,
        allowOverwrite: true,
        token: blobToken,
      });

      await db.collection("category_images").updateOne(
        { id },
        { $set: { id, pathname, url, updatedAt: now } },
        { upsert: true },
      );
      console.log(`  ✓ ${id}`);
    }
  } else if (!blobToken) {
    console.log("Blob: пропуск (нет BLOB_READ_WRITE_TOKEN)");
  }

  console.log("Готово.");
} finally {
  await client.close();
}
