import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getProductBySlug, getProducts } from "@/entities/product";
import { ProductActions } from "@/features/cart/ui/ProductActions";
import { Icon } from "@/shared/ui/Icon";
import { ProductCard } from "@/widgets/product-card/ui/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const allProducts = await getProducts();
  const related = allProducts.filter(
    (p) => p.id !== product.id && (p.goal === product.goal || p.category === product.category),
  ).slice(0, 4);

  const savings = product.oldPrice ? product.oldPrice - product.price : 0;

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-16 py-8 md:py-16">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary mb-8"
      >
        <Icon name="arrow_back" className="text-sm" />
        Назад в каталог
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="relative aspect-square bg-white rounded-3xl overflow-hidden luxury-shadow">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={80}
          />
          {product.badge && (
            <span className="absolute top-6 left-6 bg-muted-rose text-white text-xs font-bold px-3 py-1.5 rounded uppercase">
              {product.badge}
            </span>
          )}
        </div>

        <div>
          <p className="text-sm text-primary font-bold uppercase tracking-wider mb-2">
            {product.category}
          </p>
          <h1 className="font-display text-3xl md:text-4xl mb-4">{product.name}</h1>

          {product.rating && (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon
                    key={i}
                    name="star"
                    className={`text-sm ${i < Math.floor(product.rating!) ? "text-primary" : "text-outline-variant"}`}
                    filled={i < Math.floor(product.rating!)}
                  />
                ))}
              </div>
              <span className="text-sm text-on-surface-variant">
                {product.rating} ({product.reviewsCount} отзывов)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-xl line-through text-on-surface-variant">
                  {formatPrice(product.oldPrice)}
                </span>
                <span className="text-sm text-primary font-semibold">
                  Экономия {formatPrice(savings)}
                </span>
              </>
            )}
          </div>

          <p className="text-on-surface-variant mb-8 leading-relaxed">
            {product.description || product.shortDescription}
          </p>

          <ProductActions product={product} />

          <div className="grid grid-cols-2 gap-4 p-6 bg-soft-cream rounded-2xl">
            {[
              { icon: "verified", text: "100% оригинал" },
              { icon: "local_shipping", text: "Доставка по КЗ" },
              { icon: "payments", text: "Kaspi / рассрочка" },
              { icon: "redeem", text: "Подарок от 50 000 ₸" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm">
                <Icon name={item.icon} className="text-primary text-lg" filled />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 content-auto">
          <h2 className="font-display text-2xl md:text-3xl mb-8">Похожие товары</h2>
          <div className="flex gap-6 overflow-x-auto hide-scrollbar">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
