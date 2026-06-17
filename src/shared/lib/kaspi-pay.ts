import "server-only";

import { PAYMENTS } from "@/shared/config/payments";
import type { Order } from "@/entities/order";

export interface KaspiPaymentResult {
  paymentUrl: string;
  externalId?: string;
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) return `7${digits.slice(1)}`;
  if (digits.length === 10) return `7${digits}`;
  return digits;
}

/**
 * Создаёт платёж в Kaspi и возвращает URL для редиректа клиента.
 * Реализация зависит от KASPI_PROVIDER в .env
 */
export async function createKaspiPayment(order: Order): Promise<KaspiPaymentResult> {
  const phone = normalizePhone(order.customerPhone);
  const description = `Заказ ${order.orderNumber} · MediVitamins`;

  switch (PAYMENTS.provider) {
    case "link": {
      if (!PAYMENTS.staticPayUrl) {
        throw new Error("KASPI_PAY_URL не настроен");
      }
      // Статическая ссылка — сумма не передаётся; клиенту показываем сумму на сайте
      return { paymentUrl: PAYMENTS.staticPayUrl };
    }

    case "apipay": {
      const res = await fetch(`${PAYMENTS.apipay.baseUrl}/invoices`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENTS.apipay.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          amount: order.total,
          description,
          external_id: order.orderNumber,
          cart_items: order.items.map((i) => ({
            name: i.name,
            price: i.price,
            count: i.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`ApiPay: ${err}`);
      }

      const data = (await res.json()) as {
        payment_url?: string;
        pay_url?: string;
        id?: string;
      };

      const paymentUrl = data.payment_url ?? data.pay_url;
      if (!paymentUrl) {
        throw new Error("ApiPay не вернул ссылку на оплату");
      }

      return { paymentUrl, externalId: data.id };
    }

    case "kaspi": {
      // Заготовка под официальный Kaspi Pay API v2 — уточнить эндпоинт после выдачи документации
      const res = await fetch(`${PAYMENTS.kaspi.baseUrl}/payments/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENTS.kaspi.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tradePointId: PAYMENTS.kaspi.tradePointId,
          amount: order.total,
          phone,
          orderId: order.orderNumber,
          returnUrl: `${PAYMENTS.returnUrl}?order=${encodeURIComponent(order.orderNumber)}`,
          description,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Kaspi API: ${err}`);
      }

      const data = (await res.json()) as { redirectUrl?: string; paymentUrl?: string };
      const paymentUrl = data.redirectUrl ?? data.paymentUrl;
      if (!paymentUrl) {
        throw new Error("Kaspi API не вернул redirectUrl");
      }

      return { paymentUrl };
    }

    default:
      throw new Error("Kaspi Pay не подключён. Выберите «Оставить заявку» или подключите API.");
  }
}
