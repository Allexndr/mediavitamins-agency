import type { Product, ScrapedProduct } from "./types";
import upsellScraped from "./upsells.json";
import { mapScraped } from "./mappers";

export const UPSELL_PRODUCTS: Product[] = (upsellScraped as ScrapedProduct[]).map(
  (p, index) => mapScraped(p, index),
);
