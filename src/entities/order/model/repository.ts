import "server-only";

import type { Collection } from "mongodb";
import { getDb } from "@/shared/lib/mongodb";
import type { CreateOrderInput, Order, OrderStatus } from "./types";

const COLLECTION = "orders";

async function collection(): Promise<Collection<Order>> {
  const db = await getDb();
  return db.collection<Order>(COLLECTION);
}

function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MV-${y}${m}${d}-${rand}`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const col = await collection();
  const order: Order = {
    orderNumber: generateOrderNumber(),
    customerName: input.customerName.trim(),
    customerPhone: input.customerPhone.trim(),
    items: input.items,
    total: input.total,
    status: "pending",
    createdAt: new Date(),
  };

  await col.insertOne(order);
  return order;
}

export async function findOrderByNumber(orderNumber: string): Promise<Order | null> {
  const col = await collection();
  return col.findOne({ orderNumber });
}

export async function updateOrderStatus(
  orderNumber: string,
  status: OrderStatus,
): Promise<boolean> {
  const col = await collection();
  const result = await col.updateOne({ orderNumber }, { $set: { status } });
  return result.modifiedCount === 1;
}

export async function ensureOrderIndexes(): Promise<void> {
  const col = await collection();
  await col.createIndex({ orderNumber: 1 }, { unique: true });
  await col.createIndex({ createdAt: -1 });
}
