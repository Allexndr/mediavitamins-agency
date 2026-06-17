import Image from "next/image";
import { Icon } from "@/shared/ui/Icon";
import { InView } from "@/shared/ui/InView";

/** Архивные wellness-кадры — вторая волна генерации, в Instagram-сетке */
const MOOD_BOARD = [
  { image: "/images/goals/archive/goal-immunity.png", alt: "Иммунитет" },
  { image: "/images/goals/archive/goal-energy.png", alt: "Энергия" },
  { image: "/images/goals/archive/goal-skin.png", alt: "Красота кожи" },
  { image: "/images/goals/archive/goal-hair.png", alt: "Волосы и ногти" },
  { image: "/images/goals/archive/goal-gut.png", alt: "Пищеварение" },
  { image: "/images/goals/archive/goal-kids.png", alt: "Для детей" },
  { image: "/images/goals/archive/goal-women.png", alt: "Женское здоровье" },
  { image: "/images/goals/archive/goal-weight.png", alt: "Снижение веса" },
] as const;

export function ReviewsGrid() {
  return (
    <section className="py-20 md:py-24 bg-surface-container content-auto">
      <div className="max-w-7xl mx-auto px-5 md:px-16">
        <InView className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl mb-4">
            Наши клиенты в Instagram
          </h2>
          <p className="text-on-surface-variant">
            Присоединяйтесь к сообществу осознанного здоровья
          </p>
        </InView>

        <InView>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {MOOD_BOARD.map((item, i) => (
              <div
                key={item.image}
                className="aspect-square rounded-xl overflow-hidden group relative reveal-child hover:scale-[1.02] transition-transform duration-300"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  quality={75}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Icon name="favorite" className="text-white text-3xl" filled />
                </div>
              </div>
            ))}
          </div>
        </InView>
      </div>
    </section>
  );
}
