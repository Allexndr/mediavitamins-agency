/** Категории с https://www.medivitamins.kz/ */
export interface CatalogCategory {
  id: string;
  title: string;
  parentId?: string;
  icon: string;
  image?: string;
}

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    id: "uhodovaya-kosmetika",
    title: "Уходовая косметика",
    icon: "auto_awesome",
    image: "/images/categories/uhodovaya-kosmetika.png",
  },
  { id: "ochischenie", title: "Очищение", parentId: "uhodovaya-kosmetika", icon: "inventory_2", image: "/images/categories/ochischenie.png" },
  { id: "syvorotki", title: "Сыворотки", parentId: "uhodovaya-kosmetika", icon: "auto_awesome", image: "/images/categories/syvorotki.png" },
  { id: "spf", title: "SPF защита", parentId: "uhodovaya-kosmetika", icon: "shield", image: "/images/categories/spf.png" },
  { id: "microigly", title: "Микроиглы", parentId: "uhodovaya-kosmetika", icon: "spa", image: "/images/categories/microigly.png" },
  { id: "maski", title: "Маски", parentId: "uhodovaya-kosmetika", icon: "spa", image: "/images/categories/maski.png" },
  { id: "kremy", title: "Кремы", parentId: "uhodovaya-kosmetika", icon: "inventory_2", image: "/images/categories/kremy.png" },
  { id: "tonery-pady", title: "Тонеры и пэды", parentId: "uhodovaya-kosmetika", icon: "eco", image: "/images/categories/tonery-pady.png" },
  { id: "nabory", title: "Наборы", parentId: "uhodovaya-kosmetika", icon: "card_giftcard", image: "/images/categories/nabory.png" },
  { id: "uhod-za-volosami", title: "Уход за волосами", parentId: "uhodovaya-kosmetika", icon: "spa", image: "/images/categories/uhod-za-volosami.png" },
  { id: "uhod-za-telom", title: "Уход за телом", parentId: "uhodovaya-kosmetika", icon: "eco", image: "/images/categories/uhod-za-telom.png" },
  { id: "patchi", title: "Патчи", parentId: "uhodovaya-kosmetika", icon: "favorite", image: "/images/categories/patchi.png" },
  {
    id: "dekorativnaya-kosmetika",
    title: "Декоративная косметика",
    parentId: "uhodovaya-kosmetika",
    icon: "auto_awesome",
    image: "/images/categories/dekorativnaya-kosmetika.png",
  },
  { id: "collagen", title: "Коллагены", icon: "auto_awesome", image: "/images/categories/collagen.png" },
  { id: "dlya-pohudeniya", title: "Для снижения веса", icon: "fitness_center", image: "/images/categories/dlya-pohudeniya.png" },
  { id: "combucha", title: "Комбуча", icon: "eco", image: "/images/categories/combucha.png" },
  { id: "vitaminy", title: "Витамины для взрослых", icon: "shield", image: "/images/categories/vitaminy.png" },
  { id: "vitaminy-i-bady", title: "Витамины и БАДы", icon: "shield", image: "/images/categories/vitaminy-i-bady.png" },
  { id: "detskie-vitaminy", title: "Витамины для детей", icon: "child_care", image: "/images/categories/detskie-vitaminy.png" },
  { id: "hoz-tovary", title: "Хозяйственные товары", icon: "inventory_2", image: "/images/categories/hoz-tovary.png" },
  { id: "skidki", title: "Акции", icon: "redeem", image: "/images/categories/skidki.png" },
];

export const CATEGORY_TITLE: Record<string, string> = Object.fromEntries(
  CATALOG_CATEGORIES.map((c) => [c.id, c.title]),
);

export function getCategoryById(id: string) {
  return CATALOG_CATEGORIES.find((c) => c.id === id);
}

export function getRootCategories() {
  return CATALOG_CATEGORIES.filter((c) => !c.parentId);
}

export function getChildCategories(parentId: string) {
  return CATALOG_CATEGORIES.filter((c) => c.parentId === parentId);
}
