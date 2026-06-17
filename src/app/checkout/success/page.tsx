import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";
import { SITE } from "@/shared/config/site";
import { formatPrice } from "@/entities/product";

interface SuccessPageProps {
  searchParams: Promise<{ order?: string; total?: string; mode?: string }>;
}

function buildWhatsAppUrl(order: string, total: number) {
  const text = encodeURIComponent(
    `Здравствуйте! Оформил(а) заказ ${order} на сумму ${total.toLocaleString("ru-RU")} ₸. Жду счёт в Kaspi.`,
  );
  return `https://wa.me/${SITE.whatsapp}?text=${text}`;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { order, total: totalRaw, mode } = await searchParams;
  const total = totalRaw ? Number(totalRaw) : 0;
  const isCallback = mode === "callback";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="text-center max-w-md hero-fade-up">
        <div className="w-24 h-24 bg-sage-green rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in">
          <Icon name="check_circle" className="text-5xl text-tertiary" filled />
        </div>
        <h1 className="font-display text-3xl mb-4">
          {isCallback ? "Заявка принята!" : "Заказ оформлен!"}
        </h1>
        {order && (
          <p className="font-title text-sm font-semibold text-primary mb-2">
            Номер заказа: {order}
          </p>
        )}
        {total > 0 && (
          <p className="text-lg font-bold mb-2">{formatPrice(total)}</p>
        )}
        <p className="text-on-surface-variant mb-8">
          {isCallback
            ? "Мы свяжемся с вами в WhatsApp и выставим счёт в Kaspi на указанную сумму."
            : "Спасибо за покупку. Если оплата прошла в Kaspi — мы скоро подтвердим заказ."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isCallback && order && total > 0 && (
            <Button href={buildWhatsAppUrl(order, total)} variant="primary">
              Написать в WhatsApp
            </Button>
          )}
          <Button href="/catalog">Продолжить покупки</Button>
          <Button href="/" variant="outline">
            На главную
          </Button>
        </div>
      </div>
    </div>
  );
}
