import Image from "next/image";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { Icon } from "@/shared/ui/Icon";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB2u7XDQIY5q1WYmUYhv16GbsXtbPRKTQRSjpA_qiMvD-IhgvEOuRTUkyCNDVtO1Vw7HDoVVNJNAckGRtTZf4JEwoI3WSGmgehVCHKU2uKOaU9VV8-B2gTD0NwW1nMQd19rtSC0iKLCixu-PdQEZiTTxphLrAdaLGrjiQspJcS6OucePo5deWiO5_Ld--QPcYtOMYfDAPlOWmLTJ6EJw_F56tyQ4Xxiswsf9dqFfmfdCE-md5kH6k1wzE8vrr0oKVGuFruneVtxa_U";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 scale-105 hero-ken-burns">
        <Image
          src={HERO_IMAGE}
          alt="Premium wellness — витамины и косметика"
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          sizes="100vw"
          quality={80}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-surface/95 via-surface/60 to-transparent" />

      <div
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-fixed rounded-full blur-3xl pointer-events-none hidden lg:block opacity-40 animate-float"
        aria-hidden
      />
      <div
        className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-muted-rose/30 rounded-full blur-3xl pointer-events-none hidden lg:block opacity-30 animate-float"
        style={{ animationDelay: "1s" }}
        aria-hidden
      />

      <Container className="relative w-full py-20">
        <div className="max-w-2xl text-left">
          <span className="hero-fade-up inline-block py-1.5 px-4 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            Premium Wellness from Korea
          </span>

          <h1 className="hero-fade-up hero-delay-1 font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 max-w-xl">
            Здоровье и красота вашей семьи с{" "}
            <span className="gradient-text">корейским качеством</span>
          </h1>

          <p className="hero-fade-up hero-delay-2 text-base md:text-lg text-on-surface-variant mb-10 max-w-lg leading-relaxed">
            Оригинальные витамины, БАДы и косметика с доставкой по всему Казахстану.
          </p>

          <div className="hero-fade-up hero-delay-3 flex flex-col sm:flex-row gap-4">
            <Button href="/catalog">В каталог</Button>
            <Button href="/catalog#goals" variant="outline">
              Подобрать по цели
            </Button>
          </div>

          <ul
            className="hero-fade-up hero-delay-4 mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6"
            aria-label="Преимущества"
          >
            {[
              { icon: "verified", label: "100% Original" },
              { icon: "payments", label: "Kaspi Red" },
              { icon: "bolt", label: "Fast Delivery" },
            ].map((badge) => (
              <li key={badge.label} className="flex items-center gap-3">
                <Icon name={badge.icon} className="text-primary shrink-0" filled />
                <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                  {badge.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
