import type { CartItem } from "@/lib/cart/types";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "bank_transfer" | "card";

export interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingNotes?: string;
  paymentMethod: PaymentMethod;
}

export interface PlaceOrderInput {
  items: CartItem[];
  couponCode?: string | null;
  checkout: CheckoutFormData;
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  total: number;
  paymentMethod: PaymentMethod;
  emailSent?: boolean;
}
