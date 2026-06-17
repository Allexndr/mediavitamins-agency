"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/features/cart";
import { Icon } from "@/shared/ui/Icon";
import { SITE } from "@/shared/config/site";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?cat=vitaminy", label: "Витамины" },
  { href: "/catalog?cat=uhodovaya-kosmetika", label: "Косметика" },
  { href: "/catalog?cat=detskie-vitaminy", label: "Детям" },
  { href: "/catalog?cat=collagen", label: "Коллагены" },
  { href: "/catalog?promo=1", label: "Акции" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = useCartStore((s) => s.count());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full glass border-b border-outline-variant/10 shadow-sm transition-colors duration-300 ${
          scrolled ? "bg-surface/95" : "bg-surface/70"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-5 md:px-16 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-display text-2xl md:text-3xl text-deep-charcoal tracking-tight"
            >
              {SITE.name}
            </Link>
            <div className="hidden lg:flex items-center gap-6">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-title text-xs font-semibold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              type="button"
              className="p-2.5 min-w-11 min-h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Поиск"
            >
              <Icon name="search" />
            </button>
            <button
              type="button"
              className="hidden sm:flex p-2.5 min-w-11 min-h-11 items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Избранное"
            >
              <Icon name="favorite" />
            </button>
            <button
              type="button"
              onClick={toggleCart}
              className="relative p-2.5 min-w-11 min-h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 transition-transform"
              aria-label="Корзина"
            >
              <Icon name="shopping_bag" />
              {count > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-muted-rose text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-scale-in">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 min-w-11 min-h-11 flex items-center justify-center"
              aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
            >
              <Icon name={mobileOpen ? "close" : "menu"} />
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[72px] z-40 bg-surface border-b border-outline-variant/20 shadow-xl animate-slide-down">
          <div className="p-6 flex flex-col gap-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 font-title text-sm font-semibold uppercase tracking-widest"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
