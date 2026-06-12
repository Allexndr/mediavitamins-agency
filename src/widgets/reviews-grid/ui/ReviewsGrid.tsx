import Image from "next/image";
import { Icon } from "@/shared/ui/Icon";
import { InView } from "@/shared/ui/InView";

const REVIEWS = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYHhddQy3s0E4SolyIDy6AKII3pFVaL1L7q9DK3BWdWGTQpVkg_YGk4x36jG6sMsXj0YHUVpGjC1DlysjxjJj0Qs4XTLoKNg0Y6aO0lMhj3ZqTzgWxReMPmZ1gPy8OvU2dDin6FpsjQuP76uGKLEqVD6PxnJezr7-lYS7RCRIyCBfF487WhHFB7tzJwwasqBUo40Gt8gP5EELDLnWdJ_nuq6268de51LD-LdwD6suaM1ev-6HTY9zl09xZkgqqXHhhtFr3LfXBArg",
    alt: "Клиент с продуктом",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC-HElut0VKMKcSBlADvNCmOER-MV_6iPYk7ol53zP9FBU99jUAh53zWSU49uJU87h6dERjm_S6TrTxI-3FzNiRTR1ykjmP4HmNmpZy1avPMQdQoo5rIQbNXmK5ysBGR1sfQrVmiQvH7-k3u_bU9JWDNwEe_9AaNUiuWcRD2siL0PNagsgFe6fxYRRjUj_F5uwAJ65-YR7TgjgY6PVX_4TeCNtjKtqdSJC1x413IzunincwKqd3WdhArDE8K1XHSD9XjXTi-EQD4Xc",
    alt: "Рутина ухода",
  },
  {
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=75",
    alt: "Утренний ритуал",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTh8M5pBvXdLkLA2_h4LZciSr9boqyVLJRcDNrEtFiV2wU2GCXq6DHM1k9-bm1nv5EJC7r7dj1APH24SVP7scuH9n3DeX1F82YYKk0nRPw56bWNbPXRjNxJJa5GrHKvmPrBU1ul2R71vUNzE2j8ovOtxcQsEMLi7xAfHhxRpSb_bbygsSgqhYXAL_ZUm_N5THmE95Zqs8eB355dYSxfoqdtnParjVIXOneRIfVDLtEfGSI8S3vss4ni8GhXyxeyI5pTLQ_-CzgD14",
    alt: "Распаковка заказа",
  },
];

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
            {REVIEWS.map((review, i) => (
              <div
                key={review.alt}
                className="aspect-square rounded-xl overflow-hidden group relative reveal-child hover:scale-[1.02] transition-transform duration-300"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <Image
                  src={review.image}
                  alt={review.alt}
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  quality={70}
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
