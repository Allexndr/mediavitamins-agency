import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Bestsellers } from "@/widgets/bestsellers/ui/Bestsellers";
import { GoalsGrid } from "@/widgets/goals-grid/ui/GoalsGrid";
import { Hero } from "@/widgets/hero/ui/Hero";
import { TrustSection } from "@/widgets/trust-section/ui/TrustSection";
import { Icon } from "@/shared/ui/Icon";

const ReviewsGrid = dynamic(() =>
  import("@/widgets/reviews-grid/ui/ReviewsGrid").then((m) => m.ReviewsGrid),
);
const FinalCta = dynamic(() =>
  import("@/widgets/final-cta/ui/FinalCta").then((m) => m.FinalCta),
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <GoalsGrid />
      <Bestsellers />

      <section className="py-16 px-5 md:px-16 max-w-7xl mx-auto content-auto">
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 bg-tertiary text-white text-xs font-bold uppercase rounded">
            New
          </span>
          <h2 className="font-display text-2xl md:text-3xl">Новинки</h2>
        </div>
        <p className="text-on-surface-variant mb-6">
          Свежие поступления корейских брендов — только оригинал
        </p>
      </section>

      <TrustSection />

      <section className="py-20 bg-warm-beige content-auto">
        <div className="max-w-7xl mx-auto px-5 md:px-16">
          <h2 className="font-display text-3xl text-center mb-12">Гайды по здоровью</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                title: "Как выбрать идеальный коллаген для вашей кожи?",
                tag: "Экспертный блог",
                image:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuB4XG9Bk53VsDG_s2zodw9UikABNGGiLNO7_IipAjV3uTbkAiaskvuUdBWQ1QdWs2tpvdAFPJThyYCrmUB-HhYgejrEc4h0YQLpSWK90WrD5grH8TNGpHhkDe7wlRgFQFw7YRdhnEoe3Uf6r2TLceppeS96-I2km98XqDDusZM4kjg9MGbDnLndQJsShuVJUaASGVQ3BuhQGsL6HQYsATW-Txo1KO5tL70q_pi0dP4W1F1BDDwqlLdDfSoG_WvAWh6NHS7-FC1GMdA",
              },
              {
                title: "Топ-5 витаминов для поддержания иммунитета осенью",
                tag: "Иммунитет",
                image:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuB38YA5cMt_ERZ4NMd5F6e-XN6UbkQ3fAneVBt91O-f8eW7C_fcnxmmJTCa7Kd1tI7l5EKLV8_SoIwx0UhnrfT0RnXnNyxyIQsXM1XlP1jB1GUOOn9b8zElljftibJ7iiuXjIx3riPExVmoXMX1J3CwydmMB-uMDgsytUaKFJcyLde9fA0Kk_xImSD_prZAq5_jOlVNQAWydWDkDNBZNRxgLT8ruNW0kNi3zh35DxpWak6uOr9-MFeAwf-aHMCs6MzK6E_PBQwlpy0",
              },
            ].map((guide) => (
              <Link
                key={guide.title}
                href="/blog"
                className="group block relative h-[320px] md:h-[400px] overflow-hidden rounded-3xl"
              >
                <Image
                  src={guide.image}
                  alt={guide.title}
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-widest mb-2 block">
                    {guide.tag}
                  </span>
                  <h3 className="text-xl md:text-2xl font-display leading-tight">{guide.title}</h3>
                  <span className="mt-4 flex items-center text-xs font-bold border-b-2 border-white pb-1 w-fit">
                    Читать далее <Icon name="arrow_forward" className="ml-2 text-sm" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 overflow-hidden content-auto">
        <div className="max-w-7xl mx-auto px-5 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-fixed rounded-full blur-3xl opacity-30" />
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTh8M5pBvXdLkLA2_h4LZciSr9boqyVLJRcDNrEtFiV2wU2GCXq6DHM1k9-bm1nv5EJC7r7dj1APH24SVP7scuH9n3DeX1F82YYKk0nRPw56bWNbPXRjNxJJa5GrHKvmPrBU1ul2R71vUNzE2j8ovOtxcQsEMLi7xAfHhxRpSb_bbygsSgqhYXAL_ZUm_N5THmE95Zqs8eB355dYSxfoqdtnParjVIXOneRIfVDLtEfGSI8S3vss4ni8GhXyxeyI5pTLQ_-CzgD14"
              alt="Премиальная упаковка"
              width={600}
              height={500}
              loading="lazy"
              className="relative z-10 rounded-3xl luxury-shadow w-full h-auto"
              sizes="(max-width: 1024px) 100vw, 600px"
              quality={75}
            />
          </div>
          <div>
            <h2 className="font-display text-3xl md:text-4xl mb-6 leading-tight">
              С заботой в каждой детали
            </h2>
            <p className="text-lg text-on-surface-variant mb-8">
              Забота о себе начинается с момента получения посылки. Экологичные материалы и тепло в
              каждом заказе.
            </p>
            <ul className="space-y-4">
              {[
                "Брендированная премиум-коробка",
                "Подарочные пробники в каждом заказе",
                "Гарантия сохранности при доставке",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Icon name="check_circle" className="text-primary" filled />
                  <span className="font-title text-sm font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ReviewsGrid />
      <FinalCta />
    </>
  );
}
