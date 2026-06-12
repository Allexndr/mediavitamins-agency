import { SITE } from "@/shared/config/site";

export function calcShippingProgress(total: number) {
  const remaining = Math.max(SITE.freeShippingFrom - total, 0);
  const progress = Math.min((total / SITE.freeShippingFrom) * 100, 100);
  const active = total >= SITE.freeShippingFrom;
  return { remaining, progress, active };
}

export function calcGiftProgress(total: number) {
  const remaining = Math.max(SITE.giftFrom - total, 0);
  const progress = Math.min((total / SITE.giftFrom) * 100, 100);
  const active = total >= SITE.giftFrom;
  return { remaining, progress, active };
}
