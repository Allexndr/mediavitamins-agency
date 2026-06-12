"use client";

import type { Product } from "@/entities/product";
import { useCartStore } from "@/features/cart";
import { Icon } from "@/shared/ui/Icon";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
      }}
      className={`absolute bottom-4 right-4 bg-white/90 glass p-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 min-w-11 min-h-11 flex items-center justify-center ${className}`}
      aria-label={`Добавить ${product.name} в корзину`}
    >
      <Icon name="add_shopping_cart" className="text-primary" />
    </button>
  );
}
