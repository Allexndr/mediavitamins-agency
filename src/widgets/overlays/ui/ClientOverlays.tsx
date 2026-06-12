"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(
  () =>
    import("@/widgets/cart-drawer/ui/CartDrawer").then((m) => ({
      default: m.CartDrawer,
    })),
  { ssr: false },
);

const WhatsAppFloat = dynamic(
  () =>
    import("@/widgets/whatsapp-float/ui/WhatsAppFloat").then((m) => ({
      default: m.WhatsAppFloat,
    })),
  { ssr: false },
);

export function ClientOverlays() {
  return (
    <>
      <CartDrawer />
      <WhatsAppFloat />
    </>
  );
}
