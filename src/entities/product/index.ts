export {
  getProducts,
  getProductBySlug,
  getProductsByCategory,
} from "./model/products.server";
export { UPSELL_PRODUCTS } from "./model/upsells";
export { GOALS } from "./model/goals";
export { formatPrice } from "./model/format";
export {
  CATALOG_CATEGORIES,
  CATEGORY_TITLE,
  getCategoryById,
  getRootCategories,
  getChildCategories,
} from "./model/categories";
export type { Product, ProductBadge } from "./model/types";
export type { CatalogCategory } from "./model/categories";
