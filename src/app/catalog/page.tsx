import { GOALS, PRODUCTS } from "@/entities/product";
import { ProductCard } from "@/widgets/product-card/ui/ProductCard";
import { Icon } from "@/shared/ui/Icon";

interface CatalogPageProps {
  searchParams: Promise<{ goal?: string; promo?: string }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { goal, promo } = await searchParams;

  const filtered = PRODUCTS.filter((p) => {
    if (goal && p.goal !== goal) return false;
    if (promo && p.badge !== "sale") return false;
    return true;
  });

  const goalTitle = GOALS.find((g) => g.id === goal)?.title;

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-16 py-10 md:py-16">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-5xl mb-4">
          {goalTitle ? `Подборка: ${goalTitle}` : promo ? "Акции" : "Каталог"}
        </h1>
        <p className="text-on-surface-variant">
          {filtered.length} товаров · Оригинальная продукция из Кореи
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-10 pb-2">
        <a
          href="/catalog"
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            !goal && !promo
              ? "bg-primary text-white border-primary"
              : "border-outline-variant hover:border-primary"
          }`}
        >
          Все
        </a>
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
          <ProductCard key={product.id} product={product} priority={i < 4} />
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
