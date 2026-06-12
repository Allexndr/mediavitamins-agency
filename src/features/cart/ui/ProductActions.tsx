"use client";

import type { Product } from "@/entities/product";
import { useCartStore } from "@/features/cart";
import { SITE } from "@/shared/config/site";
import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <Button onClick={() => addItem(product)} className="flex-1">
        <Icon name="add_shopping_cart" />
        В корзину
      </Button>
      <Button
        href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Интересует ${product.name}`)}`}
        variant="outline"
        className="flex-1"
      >
        <Icon name="chat" />
        Спросить в WhatsApp
      </Button>
    </div>
  );
}
