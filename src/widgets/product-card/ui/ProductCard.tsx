import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/entities/product";
import { AddToCartButton } from "@/features/cart/ui/AddToCartButton";

const BADGE_LABELS: Record<string, string> = {
  hit: "Hit",
  new: "New",
  sale: "Sale",
  gift: "Gift",
};

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <article className="group min-w-[260px] md:min-w-[280px]">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden mb-4 luxury-shadow">
          {product.badge && (
            <span className="absolute top-4 left-4 z-10 bg-muted-rose text-white text-[10px] font-bold px-2 py-1 rounded uppercase">
              {BADGE_LABELS[product.badge]}
            </span>
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 45vw, 280px"
            quality={75}
          />
          <AddToCartButton product={product} />
        </div>
      </Link>
      <p className="text-xs text-primary font-bold uppercase tracking-tight mb-1">
        {product.category}
      </p>
      <Link href={`/product/${product.slug}`}>
        <h3 className="font-title text-sm font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
      </Link>
      <p className="font-title text-sm font-semibold">
        {product.oldPrice && (
          <span className="line-through text-on-surface-variant mr-2 font-normal">
            {formatPrice(product.oldPrice)}
          </span>
        )}
        {formatPrice(product.price)}
      </p>
    </article>
  );
}
