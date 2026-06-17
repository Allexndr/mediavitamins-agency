import Link from "next/link";
import { getProducts } from "@/entities/product";
import { ProductCard } from "@/widgets/product-card/ui/ProductCard";
import { Icon } from "@/shared/ui/Icon";
import { InView } from "@/shared/ui/InView";
import { Section } from "@/shared/ui/Section";

export async function Bestsellers() {
  const all = await getProducts();
  const products = all.filter((p) => p.badge === "hit" || p.badge === "sale").slice(0, 8);

  return (
    <Section background="muted" containerClassName="overflow-hidden">
      <div className="flex justify-between items-end mb-12">
        <InView className="text-left">
          <h2 className="font-display text-3xl md:text-4xl">Хиты продаж</h2>
          <p className="text-on-surface-variant mt-2">
            Популярные товары с medivitamins.kz
          </p>
        </InView>
        <Link
          href="/catalog"
          className="hidden md:flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all min-h-11"
        >
          Все товары <Icon name="arrow_forward" className="text-sm" />
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-5 px-5 md:mx-0 md:px-0 snap-x snap-mandatory">
        {products.map((product, i) => (
          <div key={product.id} className="snap-start">
            <ProductCard product={product} priority={i < 2} />
          </div>
        ))}
      </div>
    </Section>
  );
}
