import { NextResponse } from "next/server";
import { isKaspiPayAvailable, PAYMENTS } from "@/shared/config/payments";

/** Проверка: доступна ли оплата Kaspi на сайте (для UI чекаута) */
export async function GET() {
  return NextResponse.json({
    available: isKaspiPayAvailable(),
    provider: PAYMENTS.provider,
    /** Статическая ссылка — сумма не подставляется автоматически */
    isStaticLink: PAYMENTS.provider === "link",
  });
}
