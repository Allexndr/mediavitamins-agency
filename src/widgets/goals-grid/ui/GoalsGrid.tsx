import Image from "next/image";
import Link from "next/link";
import { GOALS } from "@/entities/product";
import { Icon } from "@/shared/ui/Icon";
import { InView } from "@/shared/ui/InView";
import { Section } from "@/shared/ui/Section";

export function GoalsGrid() {
  return (
    <Section id="goals">
      <InView className="text-center mb-14">
        <h2 className="font-display text-3xl md:text-4xl mb-4">Выбирайте по целям</h2>
        <div className="w-20 h-1 bg-primary mx-auto opacity-30" aria-hidden />
      </InView>

      <InView>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {GOALS.map((goal, i) => (
            <div
              key={goal.id}
              className="reveal-child"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <Link
                href={`/catalog?goal=${goal.id}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-soft-cream flex flex-col justify-end p-5 md:p-6 hover:shadow-2xl transition-shadow duration-500 min-h-[180px]"
              >
                <Image
                  src={goal.image}
                  alt={goal.title}
                  fill
                  loading={i < 4 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 45vw, 280px"
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-soft-cream via-soft-cream/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-5 left-5 w-12 h-12 rounded-full bg-white/90 glass flex items-center justify-center group-hover:scale-110 transition-transform duration-300 z-10">
                  <Icon name={goal.icon} className="text-primary text-2xl" />
                </div>

                <div className="relative z-10 text-left">
                  <h3 className="font-title text-sm font-semibold uppercase tracking-wider mb-1 group-hover:text-primary transition-colors">
                    {goal.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant">{goal.subtitle}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </InView>
    </Section>
  );
}
