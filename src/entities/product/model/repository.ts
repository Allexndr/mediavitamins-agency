import "server-only";

import type { Collection } from "mongodb";
import { getDb } from "@/shared/lib/mongodb";
import type { Product, ScrapedProduct } from "./types";
import { mapScraped } from "./mappers";

export interface ProductDocument extends ScrapedProduct {
  goal?: string;
  badge?: Product["badge"];
  blobImagePath?: string;
  localImagePath?: string;
  updatedAt: Date;
}

const COLLECTION = "products";

async function collection(): Promise<Collection<ProductDocument>> {
  const db = await getDb();
  return db.collection<ProductDocument>(COLLECTION);
}

export async function upsertProducts(docs: ProductDocument[]): Promise<number> {
  const col = await collection();
  if (docs.length === 0) return 0;

  const ops = docs.map((doc) => ({
    updateOne: {
      filter: { id: doc.id },
      update: { $set: doc },
      upsert: true,
    },
  }));

  const result = await col.bulkWrite(ops, { ordered: false });
  return result.upsertedCount + result.modifiedCount;
}

function blobMediaUrl(pathname: string): string {
  return `/api/media?pathname=${encodeURIComponent(pathname)}`;
}

function docToProduct(doc: ProductDocument, index: number): Product {
  const base = mapScraped(doc, index);
  return {
    ...base,
    image: doc.blobImagePath
      ? blobMediaUrl(doc.blobImagePath)
      : doc.localImagePath ?? base.image,
    goal: doc.goal ?? base.goal,
    badge: doc.badge ?? base.badge,
  };
}

export async function findAllProducts(): Promise<Product[]> {
  const col = await collection();
  const docs = await col.find({}).sort({ name: 1 }).toArray();
  return docs.map(docToProduct);
}

export async function findProductBySlug(slug: string): Promise<Product | undefined> {
  const col = await collection();
  const doc = await col.findOne({ slug });
  if (!doc) return undefined;
  return docToProduct(doc, 0);
}

export async function countProducts(): Promise<number> {
  const col = await collection();
  return col.countDocuments();
}

export async function ensureProductIndexes(): Promise<void> {
  const col = await collection();
  await col.createIndex({ id: 1 }, { unique: true });
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ categorySlug: 1 });
}
