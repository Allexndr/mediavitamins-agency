import { NextResponse } from "next/server";
import { findOrderByNumber } from "@/entities/order";
import { isKaspiPayAvailable } from "@/shared/config/payments";
import { createKaspiPayment } from "@/shared/lib/kaspi-pay";
import { isMongoConfigured } from "@/shared/lib/mongodb";

export async function POST(request: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "База данных не настроена" }, { status: 503 });
  }

  if (!isKaspiPayAvailable()) {
    return NextResponse.json(
      {
        error:
          "Оплата Kaspi ещё не подключена. Запросите API у Kaspi или укажите KASPI_PAY_URL в настройках.",
      },
      { status: 503 },
    );
  }

  let body: { orderNumber?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  if (!body.orderNumber) {
    return NextResponse.json({ error: "orderNumber обязателен" }, { status: 400 });
  }

  const order = await findOrderByNumber(body.orderNumber);
  if (!order) {
    return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
  }

  try {
    const payment = await createKaspiPayment(order);
    return NextResponse.json({
      ok: true,
      paymentUrl: payment.paymentUrl,
      orderNumber: order.orderNumber,
      total: order.total,
    });
  } catch (e) {
    console.error("[kaspi] payment failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Не удалось создать платёж" },
      { status: 500 },
    );
  }
}
