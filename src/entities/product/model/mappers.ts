import type { Product, ScrapedProduct } from "./types";
import { CATEGORY_TITLE } from "./categories";

function categorySlugIsPromo(slug: string) {
  return slug === "skidki";
}

function inferGoal(categorySlug: string, name: string): string | undefined {
  const n = name.toLowerCase();
  if (categorySlug === "detskie-vitaminy" || n.includes("детск")) return "kids";
  if (categorySlug === "dlya-pohudeniya" || n.includes("slim") || n.includes("диет"))
    return "weight";
  if (categorySlug === "collagen" || categorySlug.includes("uhod") || categorySlug === "syvorotki")
    return "skin";
  if (categorySlug === "uhod-za-volosami") return "hair";
  if (n.includes("пробиот") || n.includes("lacto")) return "gut";
  if (n.includes("иммун") || n.includes("im vita") || categorySlug === "vitaminy")
    return "immunity";
  if (n.includes("жен") || n.includes("moms") || n.includes("беремен")) return "women";
  if (n.includes("энерг") || n.includes("женьшень") || n.includes("ginseng")) return "energy";
  return undefined;
}

function inferBadge(p: ScrapedProduct, index: number): Product["badge"] {
  if (p.oldPrice && p.oldPrice > p.price) return "sale";
  if (categorySlugIsPromo(p.categorySlug)) return "sale";
  if (index < 8) return "hit";
  if (index % 47 === 0) return "new";
  return undefined;
}

export function mapScraped(p: ScrapedProduct, index: number): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: CATEGORY_TITLE[p.categorySlug] || p.categorySlug,
    categorySlug: p.categorySlug,
    price: p.price,
    oldPrice: p.oldPrice,
    image: p.image,
    shortDescription: p.shortDescription,
    description: p.shortDescription,
    inStock: p.inStock,
    sourceUrl: p.sourceUrl,
    goal: inferGoal(p.categorySlug, p.name),
    badge: inferBadge(p, index),
  };
}
