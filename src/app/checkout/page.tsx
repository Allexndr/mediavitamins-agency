"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice, PRODUCTS } from "@/entities/product";
import {
  calcGiftProgress,
  calcShippingProgress,
  useCartStore,
} from "@/features/cart";
import { SITE } from "@/shared/config/site";
import { Icon } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const cartTotal = total();

  const shipping = calcShippingProgress(cartTotal);
  const gift = calcGiftProgress(cartTotal);

  const upsells = PRODUCTS.filter(
    (p) => !items.some((i) => i.product.id === p.id),
  ).slice(0, 2);

  const validateStep2 = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Укажите имя";
    if (!/^[\d\s()-]{10,}$/.test(phone.replace(/\s/g, ""))) {
      next.phone = "Введите корректный номер";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const nextStep = () => {
    if (step === 2 && !validateStep2()) return;

    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      clearCart();
      router.push("/checkout/success");
    }
  };

  if (items.length === 0 && step === 1) {
    return (
      <div className="max-w-lg mx-auto px-5 py-20 text-center">
        <Icon name="shopping_bag" className="text-6xl opacity-20 mb-6" />
        <h1 className="font-display text-2xl mb-4">Корзина пуста</h1>
        <Button href="/catalog">В каталог</Button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-1 bg-surface-container fixed left-0 z-40 top-[var(--promo-height,0px)]">
        <div
          className="bg-primary h-full transition-all duration-500 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 pb-40">
        {step === 1 && (
          <section key="step1" className="animate-fade-in">
            <h1 className="font-display text-2xl md:text-3xl mb-2">Ваш заказ</h1>
            <p className="text-on-surface-variant text-sm mb-8">
              {items.length} товар(ов) в корзине
            </p>

            <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 space-y-6 border border-outline-variant/30">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <Icon name="local_shipping" className="text-primary" />
                    Бесплатная доставка
                  </span>
                  <span className="text-xs text-primary font-bold">
                    {shipping.remaining > 0
                      ? `Осталось ${formatPrice(shipping.remaining)}`
                      : "Активна!"}
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${shipping.progress}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <Icon name="redeem" className="text-primary" />
                    Подарок при заказе
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {formatPrice(cartTotal)} / {formatPrice(SITE.giftFrom)}
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-muted-rose h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${gift.progress}%` }}
                  />
                </div>
                {gift.remaining > 0 && (
                  <p className="text-[11px] mt-2 text-on-surface-variant">
                    До подарка осталось {formatPrice(gift.remaining)}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-outline-variant/20"
                >
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden shrink-0">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-sm">{item.product.name}</h3>
                      <button type="button" onClick={() => removeItem(item.product.id)}>
                        <Icon name="close" className="text-sm text-on-surface-variant" />
                      </button>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <div className="flex items-center border border-outline-variant rounded-lg">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-primary"
                        >
                          -
                        </button>
                        <span className="px-3 text-sm font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-primary"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-primary">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {upsells.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4">
                  С этим часто берут
                </h3>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                  {upsells.map((p) => (
                    <div
                      key={p.id}
                      className="min-w-[160px] bg-primary-fixed/30 p-4 rounded-xl border border-primary-fixed"
                    >
                      <div className="w-full aspect-square relative bg-white rounded-lg mb-3">
                        <Image src={p.image} alt={p.name} fill className="object-contain p-2" sizes="160px" />
                      </div>
                      <h4 className="text-xs font-bold truncate">{p.name}</h4>
                      <p className="text-primary font-bold text-sm mb-3">{formatPrice(p.price)}</p>
                      <button
                        type="button"
                        onClick={() => useCartStore.getState().addItem(p)}
                        className="w-full py-1.5 bg-primary text-white rounded-lg text-[11px] font-bold"
                      >
                        + Добавить
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {step === 2 && (
          <section key="step2" className="animate-fade-in">
            <h1 className="font-display text-2xl md:text-3xl mb-2">Доставка</h1>
            <p className="text-on-surface-variant text-sm mb-8">Куда отправить ваш заказ?</p>

            <div className="space-y-4 mb-8">
              <Input
                label="Имя"
                name="name"
                autoComplete="name"
                placeholder="Асқар Омаров"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
              <Input
                label="Телефон"
                name="tel"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="707 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                hint="Мы свяжемся для подтверждения заказа"
              />
            </div>

            <div className="space-y-3">
              <label className="relative flex items-center p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer">
                <div className="flex items-center gap-4 flex-grow">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <Icon name="inventory_2" />
                  </div>
                  <div>
                    <p className="font-bold">Kaspi Postomat</p>
                    <p className="text-xs text-on-surface-variant">Бесплатно · Самовывоз</p>
                  </div>
                </div>
                <Icon name="check_circle" className="text-primary" filled />
              </label>
              <label className="relative flex items-center p-4 rounded-xl border border-outline-variant bg-white cursor-pointer hover:border-primary transition-all">
                <div className="flex items-center gap-4 flex-grow">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                    <Icon name="local_shipping" />
                  </div>
                  <div>
                    <p className="font-bold">Курьер</p>
                    <p className="text-xs text-on-surface-variant">1 200 ₸ · До двери</p>
                  </div>
                </div>
              </label>
            </div>
          </section>
        )}

        {step === 3 && (
          <section key="step3" className="animate-fade-in">
            <h1 className="font-display text-2xl md:text-3xl mb-2">Оплата</h1>
            <p className="text-on-surface-variant text-sm mb-8">Выберите способ оплаты</p>

            <div className="space-y-4">
              <button
                type="button"
                className="w-full flex items-center justify-between p-5 rounded-2xl bg-[#E62E2E] text-white font-bold active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Icon name="qr_code_2" />
                  </div>
                  <span>Оплатить через Kaspi.kz</span>
                </div>
                <Icon name="arrow_forward_ios" className="text-sm" />
              </button>

              <div className="flex items-center gap-4 py-4">
                <div className="h-px bg-outline-variant/30 flex-grow" />
                <span className="text-xs text-on-surface-variant font-bold uppercase">или картой</span>
                <div className="h-px bg-outline-variant/30 flex-grow" />
              </div>

              <div className="p-6 rounded-2xl border-2 border-primary bg-white space-y-4">
                <div className="relative">
                  <Icon
                    name="credit_card"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  />
                  <input
                    type="text"
                    placeholder="Номер карты"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    className="px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 mt-6 text-sm text-on-surface-variant">
              <input type="checkbox" className="mt-1 rounded border-outline" defaultChecked />
              Согласен с условиями оферты и политикой конфиденциальности
            </label>
          </section>
        )}
      </div>

      <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-outline-variant/20 p-5 z-[60] shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-xl font-extrabold">
              <span>Итого</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            {shipping.active && (
              <p className="text-[10px] text-primary font-bold">Бесплатная доставка!</p>
            )}
          </div>
          <Button onClick={nextStep} className="w-full">
            {step === 1 && "Подтвердить доставку"}
            {step === 2 && "Перейти к оплате"}
            {step === 3 && "Оформить заказ"}
            <Icon name="arrow_forward" />
          </Button>
        </div>
      </footer>
    </>
  );
}
