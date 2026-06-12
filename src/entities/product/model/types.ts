export type ProductBadge = "hit" | "new" | "sale" | "gift";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
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
}
