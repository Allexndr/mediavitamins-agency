import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";

export default function SuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="text-center max-w-md hero-fade-up">
        <div className="w-24 h-24 bg-sage-green rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in">
          <Icon name="check_circle" className="text-5xl text-tertiary" filled />
        </div>
        <h1 className="font-display text-3xl mb-4">Заказ оформлен!</h1>
        <p className="text-on-surface-variant mb-8">
          Спасибо за покупку. Мы свяжемся с вами в WhatsApp для подтверждения заказа.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/catalog">Продолжить покупки</Button>
          <Button href="/" variant="outline">
            На главную
          </Button>
        </div>
      </div>
    </div>
  );
}
