import { Button } from "@/shared/ui/Button";
import { InView } from "@/shared/ui/InView";

export function FinalCta() {
  return (
    <section className="py-20 md:py-28 px-5 md:px-16 relative overflow-hidden content-auto">
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary-fixed via-soft-cream to-sage-green opacity-60 animate-gradient-shift"
        aria-hidden
      />
      <InView className="relative max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-5xl mb-6 leading-tight">
          Начните путь к здоровью уже сегодня
        </h2>
        <p className="text-on-surface-variant text-lg mb-10">
          Бесплатная доставка от 20 000 ₸. Консультация нутрициолога — бесплатно.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/catalog">Перейти в каталог</Button>
          <Button href="/catalog#goals" variant="outline">
            Подобрать по цели
          </Button>
        </div>
      </InView>
    </section>
  );
}
