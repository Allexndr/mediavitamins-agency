"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/features/cart";
import { Icon } from "@/shared/ui/Icon";

const ITEMS = [
  { href: "/", icon: "home", label: "Главная" },
  { href: "/catalog", icon: "grid_view", label: "Каталог" },
  { href: "/cart", icon: "shopping_bag", label: "Корзина", cart: true },
  { href: "/catalog?fav=1", icon: "favorite", label: "Избранное" },
  { href: "/contacts", icon: "person", label: "Профиль" },
];

export function MobileNav() {
  const pathname = usePathname();
  const count = useCartStore((s) => s.count());

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/95 glass border-t border-outline-variant/30 px-4 py-2 pb-6 z-50 flex justify-between">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 min-w-12 min-h-12 justify-center relative ${
              active ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <Icon name={item.icon} filled={active} className="text-xl" />
            <span className="text-[10px] font-medium">{item.label}</span>
            {item.cart && count > 0 && (
              <span className="absolute top-0 right-0 bg-muted-rose text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
