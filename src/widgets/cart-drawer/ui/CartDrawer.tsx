"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, UPSELL_PRODUCTS } from "@/entities/product/client";
import { calcGiftProgress, calcShippingProgress, useCartStore } from "@/features/cart";
import { Icon } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/Button";

export function CartDrawer() {
  const { items, isOpen, setCartOpen, updateQuantity, removeItem, total } = useCartStore();
  const cartTotal = total();
  const gift = calcGiftProgress(cartTotal);
  const shipping = calcShippingProgress(cartTotal);

  const upsells = UPSELL_PRODUCTS.filter(
    (p) => !items.some((i) => i.product.id === p.id),
  ).slice(0, 2);

  if (!isOpen) return null;

  return (
    <>
      <div
        role="presentation"
        onClick={() => setCartOpen(false)}
        className="fixed inset-0 bg-black/40 z-[90] animate-fade-in"
      />
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[100] shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-display text-2xl">Корзина ({items.length})</h3>
          <button type="button" onClick={() => setCartOpen(false)} className="p-2 min-w-11 min-h-11" aria-label="Закрыть">
            <Icon name="close" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-soft-cream p-4 rounded-2xl">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span>
                {gift.remaining > 0
                  ? `До подарка осталось ${formatPrice(gift.remaining)}`
                  : "Вам доступен подарок!"}
              </span>
              <span>{Math.round(gift.progress)}%</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-muted-rose to-primary-container transition-all duration-700 ease-out"
                style={{ width: `${gift.progress}%` }}
              />
            </div>
            <p className="text-[11px] text-on-surface-variant mt-2">
              {shipping.active
                ? "Бесплатная доставка активна!"
                : `До бесплатной доставки ${formatPrice(shipping.remaining)}`}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <Icon name="shopping_bag" className="text-5xl mb-4 opacity-30" />
              <p>Корзина пуста</p>
              <Link href="/catalog" onClick={() => setCartOpen(false)} className="inline-block mt-6">
                <Button>В каталог</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-surface-container rounded-xl overflow-hidden relative shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-title text-sm mb-1">{item.product.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border rounded-full px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 min-w-8 min-h-8 flex items-center justify-center"
                          aria-label="Уменьшить"
                        >
                          <Icon name="remove" className="text-sm" />
                        </button>
                        <span className="px-2 font-bold text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 min-w-8 min-h-8 flex items-center justify-center"
                          aria-label="Увеличить"
                        >
                          <Icon name="add" className="text-sm" />
                        </button>
                      </div>
                      <span className="font-bold">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="text-xs text-on-surface-variant mt-2 hover:text-error"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {upsells.length > 0 && items.length > 0 && (
            <div className="pt-6 border-t">
              <h4 className="font-title text-xs uppercase tracking-widest mb-4">
                С этим часто берут
              </h4>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                {upsells.map((p) => (
                  <div
                    key={p.id}
                    className="min-w-[140px] bg-soft-cream p-3 rounded-xl flex flex-col items-center"
                  >
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden mb-2">
                      <Image src={p.image} alt={p.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <p className="text-[10px] font-bold text-center line-clamp-2 h-8">{p.name}</p>
                    <button
                      type="button"
                      onClick={() => useCartStore.getState().addItem(p)}
                      className="mt-2 text-primary font-bold text-xs uppercase"
                    >
                      + Добавить
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg">Итого:</span>
              <span className="text-xl font-bold">{formatPrice(cartTotal)}</span>
            </div>
            <Link href="/checkout" onClick={() => setCartOpen(false)}>
              <Button className="w-full">Оформить заказ</Button>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
