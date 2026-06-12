import { Icon } from "@/shared/ui/Icon";
import { InView } from "@/shared/ui/InView";
import { Section } from "@/shared/ui/Section";

const ITEMS = [
  {
    icon: "inventory_2",
    title: "Premium Packaging",
    text: "Каждый заказ упакован в экологичную премиальную упаковку, которую приятно открывать.",
  },
  {
    icon: "card_giftcard",
    title: "Gift with Purchase",
    text: "При заказе от 50 000 ₸ мы дарим полноразмерный набор косметики или витаминов.",
  },
  {
    icon: "support_agent",
    title: "Expert Consultation",
    text: "Нутрициологи помогут подобрать комплекс в WhatsApp 24/7.",
  },
];

export function TrustSection() {
  return (
    <Section>
      <InView>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {ITEMS.map((item, i) => (
            <article
              key={item.title}
              className="text-center group reveal-child"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-20 h-20 bg-soft-cream rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors duration-300 group-hover:scale-105">
                <Icon
                  name={item.icon}
                  className="text-primary text-4xl group-hover:text-white transition-colors"
                />
              </div>
              <h3 className="font-title text-sm font-semibold uppercase tracking-wider mb-3">
                {item.title}
              </h3>
              <p className="text-on-surface-variant text-left md:text-center leading-relaxed">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </InView>
    </Section>
  );
}
