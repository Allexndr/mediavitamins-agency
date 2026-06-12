import { SITE } from "@/shared/config/site";

export function PromoBar() {
  return (
    <div className="bg-soft-cream py-2.5 border-b border-outline-variant/20 overflow-hidden hero-fade-up">
      <div className="max-w-7xl mx-auto px-5 md:px-16 flex justify-between items-center">
        <p className="text-xs md:text-sm font-medium uppercase tracking-wider text-on-surface-variant animate-pulse">
          Бесплатная доставка от {SITE.freeShippingFrom.toLocaleString("ru-RU")} ₸
          <span className="hidden sm:inline">
            {" "}
            | Подарок от {SITE.giftFrom.toLocaleString("ru-RU")} ₸ | Kaspi Red
          </span>
        </p>
        <div className="hidden md:flex items-center gap-6 text-xs text-on-surface-variant">
          <a href={SITE.instagram} className="hover:text-primary transition-colors">
            Instagram
          </a>
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            className="hover:text-primary transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
