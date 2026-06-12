import type { Product } from "./types";

export const GOALS = [
  {
    id: "immunity",
    title: "Иммунитет",
    subtitle: "Защита организма",
    icon: "shield",
    image: "/images/goals/goal-immunity.png",
  },
  {
    id: "energy",
    title: "Энергия",
    subtitle: "Тонус и бодрость",
    icon: "bolt",
    image: "/images/goals/goal-energy.png",
  },
  {
    id: "skin",
    title: "Красота кожи",
    subtitle: "Сияние изнутри",
    icon: "auto_awesome",
    image: "/images/goals/goal-skin.png",
  },
  {
    id: "hair",
    title: "Волосы и ногти",
    subtitle: "Густота и сила",
    icon: "spa",
    image: "/images/goals/goal-hair.png",
  },
  {
    id: "gut",
    title: "Пищеварение",
    subtitle: "Легкость и ЖКТ",
    icon: "eco",
    image: "/images/goals/goal-gut.png",
  },
  {
    id: "kids",
    title: "Для детей",
    subtitle: "Рост и развитие",
    icon: "child_care",
    image: "/images/goals/goal-kids.png",
  },
  {
    id: "women",
    title: "Женское здоровье",
    subtitle: "Гормональный баланс",
    icon: "favorite",
    image: "/images/goals/goal-women.png",
  },
  {
    id: "weight",
    title: "Снижение веса",
    subtitle: "Метаболизм и форма",
    icon: "fitness_center",
    image: "/images/goals/goal-weight.png",
  },
] as const;

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "multivitamin-complex-premium",
    name: "Multivitamin Complex Premium",
    category: "Vitamins",
    price: 18_500,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUrnciubB_6HmtqKf6ixZ7VilGkRbcG-cNvyHtwC1zIcMGLUxdCYF-pCrGjSxMXupjlvFAs_0ifbTLN2SNdoh0XItN8J2fcpi61sFAUj4aujW96-XkCv5l7mDL2ahFlAeLmmNZWTIblJUl7jpsFkNP0s0rnk_il4dMBmHCZTdt7raAlww5AHM-xTk2GRFzKcJmLZY5oHScR53jc1IMkj5YHkI2pcdWgu2rggYs4XsjHM1rZMOQR-6bZ6OQLAiIvaa25QOscR79D90",
    badge: "hit",
    goal: "immunity",
    shortDescription: "Полный комплекс витаминов и минералов для ежедневной поддержки организма.",
    description:
      "Премиальный мультивитаминный комплекс корейского производства. 60 капсул — курс на 2 месяца. Подходит для активного образа жизни.",
    inStock: true,
    rating: 4.9,
    reviewsCount: 128,
  },
  {
    id: "2",
    slug: "radiance-glow-collagen-serum",
    name: "Radiance Glow Collagen Serum",
    category: "Skincare",
    price: 20_400,
    oldPrice: 24_000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQEPCBfhymX88HQfMd6tdBzyxrurSJz_I6Ll4c-eEuLkIP72DLwXq_wfJIb9cXzPYa5tTEuMSni16Ok_XTii-EIHVzIK_pRxuH1v-v1GhL_lbxqz0T8feDAc4OYNrUzPvSJvRn0cXYSoEJiphv4fcRAPhHXoH78WRwgFRgIlFtO1NVqMAgRCQz0TgxHPjBlL42EJfu8PhwbZ0L-PXqt2Nhl6IycRpx0mvV1eJMC7C3FBWFx9Gik4wyhEncqWY_xLGy6zy7iBKKGK0",
    badge: "sale",
    goal: "skin",
    shortDescription: "Сыворотка с морским коллагеном для сияния и упругости кожи.",
    inStock: true,
    rating: 4.8,
    reviewsCount: 94,
  },
  {
    id: "3",
    slug: "lacto-bifido-probiotic-10b",
    name: "Lacto-Bifido Probiotic 10B",
    category: "Health",
    price: 12_900,
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
    goal: "gut",
    shortDescription: "10 миллиардов КОЕ пробиотиков для здоровья ЖКТ.",
    inStock: true,
    rating: 4.7,
    reviewsCount: 67,
  },
  {
    id: "4",
    slug: "omega-3-triple-strength",
    name: "Omega-3 Triple Strength 1200mg",
    category: "Essentials",
    price: 15_000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC740AoEksRePCSK1v44yNGe6AfewQCB8en8wQQuQkE2pJ953xOl8re-pABzakh90YAVXjk6EdTkUY1NQdDdYInPYElkI3p1M0h6etDogtehc4NGvBWGMH4uHvDLwNaFThyoHBsKOT6VcRVQvrabc0znCqxD0NWdNDCb5TGKtgq17UPxxWP9eblmYz4jxDxUPCelSLSSTu5UOTH7h6fTKnwXu-4hl5lIVZZke4KZZ8549HN3dEyq0MqIDxbwWHHtLpRbz6cV_fv_QM",
    goal: "immunity",
    shortDescription: "Высокая концентрация EPA и DHA для сердца и мозга.",
    inStock: true,
    rating: 4.9,
    reviewsCount: 203,
  },
  {
    id: "5",
    slug: "vitamin-d3-k2",
    name: "Vitamin D3 + K2",
    category: "Vitamins",
    price: 12_500,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOHvnyqFEL0npsIMwXaX04IgUmlMPN7DCr6dT1vnv-fYMvwG_U4s63tiyreYl7M6-Sm4rpxE87tz7LrDVYvOcZBiCrH7CwXFWcgU3Lv7CCZJ3CEKa-DXS5EXsy8MgTPI8VvSPU8uymVBuRiVMEjXCyNztXXjzwcPoejU8qGKUGUOhnOfNKTAg33LXpvDrHK1VEyTmGbCbCxb22gbdo2HpYlaVX-w1DxYdD_jcfcXfVtB_D5QO_9rgZHQFsXHJlH8P9TemAnpXwwmk",
    badge: "new",
    goal: "immunity",
    shortDescription: "Липосомальная формула для максимального усвоения.",
    inStock: true,
    rating: 4.8,
    reviewsCount: 45,
  },
  {
    id: "6",
    slug: "marine-collagen",
    name: "Marine Collagen",
    category: "Beauty",
    price: 18_900,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZNdBMgVnroTSJ3KI8kUbabSCY_GlOLHn5IFt_BwGJFLc2J21mKKF-GMrmER-ANujydecW5Kmq5kVWtR3kGkHh0VgpJHNNXEneED-dn3jur7EEt-IkhycG66Vo_BAEDlhjDYO-Cv1O1nhiXeGXl15Wyunbxfh1YJavICCEeR3lt5kM_FAraSh4HTf0xEEWLrfhoiLTYQedNmzeBvjffnvM9QhOTWOzJUy4-IdRAVYSBAZadXHABugI-42A-5X72enfYajTFZTyhZI",
    goal: "skin",
    shortDescription: "Дикий морской коллаген для кожи, волос и суставов.",
    inStock: true,
    rating: 4.9,
    reviewsCount: 156,
  },
];

export function formatPrice(price: number): string {
  return `${price.toLocaleString("ru-RU")} ₸`;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
