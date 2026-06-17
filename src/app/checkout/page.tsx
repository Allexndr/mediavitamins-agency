"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice, UPSELL_PRODUCTS } from "@/entities/product/client";
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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"kaspi" | "callback">("callback");
  const [kaspiAvailable, setKaspiAvailable] = useState(false);
  const [kaspiIsStaticLink, setKaspiIsStaticLink] = useState(false);
  const cartTotal = total();

  useEffect(() => {
    fetch("/api/payments/kaspi/status")
      .then((r) => r.json())
      .then((data: { available?: boolean; isStaticLink?: boolean }) => {
        if (data.available) {
          setKaspiAvailable(true);
          setKaspiIsStaticLink(Boolean(data.isStaticLink));
          setPaymentMethod("kaspi");
        }
      })
      .catch(() => undefined);
  }, []);

  const shipping = calcShippingProgress(cartTotal);
  const gift = calcGiftProgress(cartTotal);

  const upsells = UPSELL_PRODUCTS.filter(
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

  const submitOrder = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          total: cartTotal,
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
          })),
        }),
      });

      const data = (await res.json()) as { orderNumber?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Ошибка оформления");
      }

      const orderNumber = data.orderNumber;
      clearCart();

      if (paymentMethod === "kaspi" && orderNumber) {
        const payRes = await fetch("/api/payments/kaspi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderNumber }),
        });
        const payData = (await payRes.json()) as {
          paymentUrl?: string;
          error?: string;
          total?: number;
        };

        if (!payRes.ok) {
          throw new Error(payData.error ?? "Не удалось открыть оплату Kaspi");
        }

        if (payData.paymentUrl) {
          const returnParams = new URLSearchParams({
            order: orderNumber,
            total: String(payData.total ?? cartTotal),
          });
          sessionStorage.setItem("mv_pending_order", orderNumber);
          window.location.href = payData.paymentUrl;
          return;
        }
      }

      const params = new URLSearchParams();
      if (orderNumber) params.set("order", orderNumber);
      params.set("total", String(cartTotal));
      params.set("mode", "callback");
      router.push(`/checkout/success?${params.toString()}`);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Не удалось оформить заказ");
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 2 && !validateStep2()) return;

    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    void submitOrder();
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
            <p className="text-on-surface-variant text-sm mb-8">
              Сумма к оплате: <strong className="text-on-surface">{formatPrice(cartTotal)}</strong>
            </p>

            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod("kaspi")}
                disabled={!kaspiAvailable}
                className={`w-full flex items-center justify-between p-5 rounded-2xl font-bold transition-all text-left ${
                  paymentMethod === "kaspi"
                    ? "bg-[#E62E2E] text-white ring-2 ring-[#E62E2E] ring-offset-2"
                    : "bg-[#E62E2E]/90 text-white opacity-60"
                } ${!kaspiAvailable ? "opacity-40 cursor-not-allowed" : "active:scale-[0.98]"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Icon name="qr_code_2" />
                  </div>
                  <div>
                    <span className="block">Оплатить сейчас в Kaspi</span>
                    <span className="text-xs font-normal opacity-90">
                      {kaspiAvailable
                        ? kaspiIsStaticLink
                          ? "Переход в Kaspi (сумму уточните в приложении)"
                          : `Счёт на ${formatPrice(cartTotal)} в приложении Kaspi`
                        : "Подключим после получения API от Kaspi"}
                    </span>
                  </div>
                </div>
                {paymentMethod === "kaspi" && kaspiAvailable && (
                  <Icon name="check_circle" filled />
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("callback")}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                  paymentMethod === "callback"
                    ? "border-primary bg-primary/5"
                    : "border-outline-variant bg-white hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                    <Icon name="chat" className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">Оставить заявку</p>
                    <p className="text-xs text-on-surface-variant">
                      Мы напишем в WhatsApp и выставим счёт вручную
                    </p>
                  </div>
                </div>
                {paymentMethod === "callback" && (
                  <Icon name="check_circle" className="text-primary" filled />
                )}
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Kaspi QR, Kaspi Red и рассрочка 0-0-12 — в приложении Kaspi.kz после выставления счёта.
            </p>

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
          {submitError && (
            <p className="text-sm text-red-600 mb-3 text-center">{submitError}</p>
          )}
          <Button onClick={nextStep} className="w-full" disabled={submitting}>
            {step === 1 && "Подтвердить доставку"}
            {step === 2 && "Перейти к оплате"}
            {step === 3 &&
              (submitting
                ? "Оформляем..."
                : paymentMethod === "kaspi" && kaspiAvailable
                  ? `Оплатить ${formatPrice(cartTotal)} в Kaspi`
                  : "Отправить заявку")}
            <Icon name="arrow_forward" />
          </Button>
        </div>
      </footer>
    </>
  );
}
