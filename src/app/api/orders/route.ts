import { NextResponse } from "next/server";
import { createOrder } from "@/entities/order";
import type { CreateOrderInput } from "@/entities/order";
import { isMongoConfigured } from "@/shared/lib/mongodb";
import { uploadPrivateBlob, isBlobConfigured } from "@/shared/lib/blob";

function isValidOrderBody(body: unknown): body is CreateOrderInput {
  if (!body || typeof body !== "object") return false;
  const b = body as CreateOrderInput;
  return (
    typeof b.customerName === "string" &&
    b.customerName.trim().length >= 2 &&
    typeof b.customerPhone === "string" &&
    b.customerPhone.replace(/\D/g, "").length >= 10 &&
    Array.isArray(b.items) &&
    b.items.length > 0 &&
    b.items.every(
      (i) =>
        typeof i.productId === "string" &&
        typeof i.slug === "string" &&
        typeof i.name === "string" &&
        typeof i.price === "number" &&
        typeof i.quantity === "number" &&
        i.quantity > 0,
    ) &&
    typeof b.total === "number" &&
    b.total > 0
  );
}

export async function POST(request: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "База данных не настроена" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  if (!isValidOrderBody(body)) {
    return NextResponse.json({ error: "Некорректные данные заказа" }, { status: 400 });
  }

  try {
    const order = await createOrder(body);

    if (isBlobConfigured()) {
      const snapshot = JSON.stringify(order, null, 2);
      await uploadPrivateBlob(
        `orders/${order.orderNumber}.json`,
        snapshot,
        "application/json",
      );
    }

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
    });
  } catch (e) {
    console.error("[orders] create failed:", e);
    return NextResponse.json({ error: "Не удалось создать заказ" }, { status: 500 });
  }
}
