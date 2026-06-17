import {
  CATALOG_CATEGORIES,
  CATEGORY_TITLE,
  getProducts,
  GOALS,
} from "@/entities/product";
import { getCategoryImageUrl } from "@/entities/product/model/category-images";
import { ProductCard } from "@/widgets/product-card/ui/ProductCard";
import { Icon } from "@/shared/ui/Icon";
import Image from "next/image";
import Link from "next/link";

interface CatalogPageProps {
  searchParams: Promise<{ goal?: string; cat?: string; promo?: string }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { goal, cat, promo } = await searchParams;

  const products = await getProducts();

  const childCatIds = cat
    ? CATALOG_CATEGORIES.filter((c) => c.parentId === cat).map((c) => c.id)
    : [];

  const filtered = products.filter((p) => {
    if (cat) {
      const inCategory =
        p.categorySlug === cat || childCatIds.includes(p.categorySlug);
      if (!inCategory) return false;
    }
    if (goal && p.goal !== goal) return false;
    if (promo && p.badge !== "sale") return false;
    return true;
  });

  const goalTitle = GOALS.find((g) => g.id === goal)?.title;
  const catTitle = cat ? CATEGORY_TITLE[cat] || cat : undefined;
  const pageTitle = goalTitle
    ? `Подборка: ${goalTitle}`
    : catTitle
      ? catTitle
      : promo
        ? "Акции"
        : "Каталог";

  const rootCats = CATALOG_CATEGORIES.filter((c) => !c.parentId);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-16 py-10 md:py-16">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-5xl mb-4">{pageTitle}</h1>
        <p className="text-on-surface-variant">
          {filtered.length} товаров · Оригинальная продукция из Кореи
        </p>
      </div>

      {!cat && !goal && !promo && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {rootCats.map((category) => (
            <Link
              key={category.id}
              href={`/catalog?cat=${category.id}`}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-soft-cream hover:shadow-xl transition-shadow"
            >
              {(getCategoryImageUrl(category.id, category.image) ?? category.image) && (
                <Image
                  src={getCategoryImageUrl(category.id, category.image) ?? category.image!}
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 45vw, 280px"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-soft-cream via-soft-cream/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                <Icon name={category.icon} className="text-primary" />
                <span className="font-title text-xs font-semibold uppercase tracking-wider">
                  {category.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-2">
        <a
          href="/catalog"
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            !goal && !cat && !promo
              ? "bg-primary text-white border-primary"
              : "border-outline-variant hover:border-primary"
          }`}
        >
          Все
        </a>
        {CATALOG_CATEGORIES.filter((c) => !c.parentId).map((c) => (
          <a
            key={c.id}
            href={`/catalog?cat=${c.id}`}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
              cat === c.id
                ? "bg-primary text-white border-primary"
                : "border-outline-variant hover:border-primary"
            }`}
          >
            {c.title}
          </a>
        ))}
      </div>

      {cat && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-10 pb-2">
          {CATALOG_CATEGORIES.filter((c) => c.parentId === cat).map((c) => (
            <a
              key={c.id}
              href={`/catalog?cat=${c.id}`}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-outline-variant hover:border-primary transition-colors whitespace-nowrap"
            >
              {c.title}
            </a>
          ))}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-10 pb-2">
        {GOALS.map((g) => (
          <a
            key={g.id}
            href={`/catalog?goal=${g.id}`}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors flex items-center gap-2 ${
              goal === g.id
                ? "bg-primary text-white border-primary"
                : "border-outline-variant hover:border-primary"
            }`}
          >
            <Icon name={g.icon} className="text-base" />
            {g.title}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i < 8} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-on-surface-variant">
          <Icon name="search_off" className="text-5xl mb-4 opacity-30" />
          <p>Товары не найдены</p>
        </div>
      )}
    </div>
  );
}
