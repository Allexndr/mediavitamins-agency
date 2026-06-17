import "server-only";

import { unstable_cache } from "next/cache";
import type { Product, ScrapedProduct } from "./types";
import scraped from "./products.json";
import { mapScraped } from "./mappers";
import { isMongoConfigured } from "@/shared/lib/mongodb";
import { findAllProducts, findProductBySlug as findBySlugDb } from "./repository";

const JSON_PRODUCTS: Product[] = (scraped as ScrapedProduct[]).map(mapScraped);

const loadProducts = unstable_cache(
  async (): Promise<Product[]> => {
    if (isMongoConfigured()) {
      try {
        const fromDb = await findAllProducts();
        if (fromDb.length > 0) return fromDb;
      } catch (e) {
        console.error("[products] MongoDB fallback to JSON:", e);
      }
    }
    return JSON_PRODUCTS;
  },
  ["catalog-products"],
  { revalidate: 300, tags: ["products"] },
);

export async function getProducts(): Promise<Product[]> {
  return loadProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (isMongoConfigured()) {
    try {
      const fromDb = await findBySlugDb(slug);
      if (fromDb) return fromDb;
    } catch (e) {
      console.error("[products] slug lookup fallback:", e);
    }
  }
  return JSON_PRODUCTS.find((p) => p.slug === slug);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.categorySlug === categorySlug);
}

/** @deprecated Используйте getProducts() */
export const PRODUCTS = JSON_PRODUCTS;
