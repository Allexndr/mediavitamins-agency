/**
 * Настройки оплаты Kaspi.
 *
 * KASPI_PROVIDER:
 *   - "none"     — только заявка / WhatsApp (по умолчанию)
 *   - "link"     — редирект на статическую ссылку KASPI_PAY_URL (сумма не передаётся)
 *   - "apipay"   — ApiPay.kz API (нужен APIPAY_API_KEY)
 *   - "kaspi"    — официальный Kaspi Pay API (нужны KASPI_API_KEY, KASPI_TRADE_POINT_ID)
 */
export type KaspiProvider = "none" | "link" | "apipay" | "kaspi";

export const PAYMENTS = {
  provider: (process.env.KASPI_PROVIDER ?? "none") as KaspiProvider,
  /** Статическая ссылка Kaspi (временный вариант от менеджера) */
  staticPayUrl: process.env.KASPI_PAY_URL ?? "",
  apipay: {
    apiKey: process.env.APIPAY_API_KEY ?? "",
    baseUrl: process.env.APIPAY_BASE_URL ?? "https://apipay.kz/api/v1",
  },
  kaspi: {
    apiKey: process.env.KASPI_API_KEY ?? "",
    tradePointId: process.env.KASPI_TRADE_POINT_ID ?? "",
    baseUrl: process.env.KASPI_API_BASE_URL ?? "https://pay.kaspi.kz/api/v2",
  },
  returnUrl: process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`
    : "http://localhost:3000/checkout/success",
} as const;

export function isKaspiPayAvailable(): boolean {
  switch (PAYMENTS.provider) {
    case "link":
      return Boolean(PAYMENTS.staticPayUrl);
    case "apipay":
      return Boolean(PAYMENTS.apipay.apiKey);
    case "kaspi":
      return Boolean(PAYMENTS.kaspi.apiKey && PAYMENTS.kaspi.tradePointId);
    default:
      return false;
  }
}
