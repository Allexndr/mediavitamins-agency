import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import { Footer } from "@/widgets/footer/ui/Footer";
import { Header } from "@/widgets/header/ui/Header";
import { MobileNav } from "@/widgets/mobile-nav/ui/MobileNav";
import { ClientOverlays } from "@/widgets/overlays/ui/ClientOverlays";
import { PromoBar } from "@/widgets/promo-bar/ui/PromoBar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  weight: ["500", "600", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Medivitamins.kz | Корейское качество для вашего здоровья",
  description:
    "Оригинальные витамины, БАДы и косметика с доставкой по Казахстану. Бесплатная доставка от 20 000 ₸.",
  openGraph: {
    title: "Medivitamins.kz",
    description: "Premium wellness from Korea",
    locale: "ru_KZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${playfair.variable} ${montserrat.variable}`}
    >
      <body className="pb-20 md:pb-0">
        <PromoBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <ClientOverlays />
        <MobileNav />
      </body>
    </html>
  );
}
