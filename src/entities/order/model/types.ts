export type OrderStatus = "pending" | "confirmed" | "cancelled";

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
}
