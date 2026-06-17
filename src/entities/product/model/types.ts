export type ProductBadge = "hit" | "new" | "sale" | "gift";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: ProductBadge;
  goal?: string;
  description?: string;
  shortDescription?: string;
  inStock?: boolean;
  rating?: number;
  reviewsCount?: number;
  sourceUrl?: string;
}

export interface ScrapedProduct {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  image: string;
  shortDescription: string;
  inStock: boolean;
  sourceUrl: string;
}
