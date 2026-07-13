"use server";

import { randomUUID } from "crypto";
import { sendOrderConfirmationEmail } from "@/lib/email/order-confirmation";
import { calculateCartTotals } from "@/lib/cart/utils";
import type { PlaceOrderInput, PlacedOrder } from "@/lib/orders/types";
import type { Database } from "@/lib/supabase/database.types";
import { createServerClient } from "@/lib/supabase/server";

type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
type OrderItemInsert = Database["public"]["Tables"]["order_items"]["Insert"];

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function generateOrderNumber(): string {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HW-${stamp}-${random}`;
}

function orderErrorMessage(message?: string): string {
  if (!message) {
    return "Could not place your order. Please try again.";
  }

  if (
    message.includes("does not exist") ||
    message.includes("Could not find the table")
  ) {
    return "Orders are not set up yet. Run supabase/orders.sql in your Supabase SQL Editor.";
  }

  if (
    message.includes("row-level security") ||
    message.includes("permission denied")
  ) {
    return "Order permissions are not configured. Run supabase/orders.sql in Supabase.";
  }

  return "Could not place your order. Please try again.";
}

export async function placeOrder(
  input: PlaceOrderInput
): Promise<{ success: true; order: PlacedOrder } | { success: false; error: string }> {
  const { items, checkout, couponCode } = input;

  if (items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  if (
    !checkout.customerName.trim() ||
    !checkout.customerEmail.trim() ||
    !checkout.customerPhone.trim() ||
    !checkout.shippingAddress.trim() ||
    !checkout.shippingCity.trim()
  ) {
    return { success: false, error: "Please fill in all required fields." };
  }

  const totals = calculateCartTotals(items, couponCode);

  const supabase = createServerClient();

  if (!supabase) {
    return {
      success: false,
      error: "Orders are temporarily unavailable. Please try again later.",
    };
  }

  const orderNumber = generateOrderNumber();
  const orderId = randomUUID();

  const orderPayload: OrderInsert = {
    id: orderId,
    order_number: orderNumber,
    status: "pending",
    customer_name: checkout.customerName.trim(),
    customer_email: checkout.customerEmail.trim().toLowerCase(),
    customer_phone: checkout.customerPhone.trim(),
    shipping_address: checkout.shippingAddress.trim(),
    shipping_city: checkout.shippingCity.trim(),
    shipping_notes: checkout.shippingNotes?.trim() || null,
    payment_method: checkout.paymentMethod,
    coupon_code: couponCode?.trim().toUpperCase() || null,
    subtotal: totals.subtotal,
    shipping_cost: totals.shipping,
    discount: totals.discount,
    total: totals.total,
  };

  const { error: orderError } = await supabase
    .from("orders")
    .insert(orderPayload);

  if (orderError) {
    console.error("[orders] insert failed:", orderError.message, orderError.code);
    return {
      success: false,
      error: orderErrorMessage(orderError.message),
    };
  }

  const orderItems: OrderItemInsert[] = items.map((item) => ({
    order_id: orderId,
    product_id:
      item.type === "product" && isUuid(item.productId) ? item.productId : null,
    product_name:
      item.type === "deal"
        ? `${item.name} (Deal)`
        : item.name,
    product_slug: item.slug,
    product_image: item.image,
    unit_price: item.price,
    quantity: item.quantity,
    line_total: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("[orders] items insert failed:", itemsError.message);
    return {
      success: false,
      error: "Could not save order items. Please contact support.",
    };
  }

  const emailResult = await sendOrderConfirmationEmail({
    orderNumber,
    orderId,
    customer: {
      ...checkout,
      customerName: checkout.customerName.trim(),
      customerEmail: checkout.customerEmail.trim().toLowerCase(),
      customerPhone: checkout.customerPhone.trim(),
      shippingAddress: checkout.shippingAddress.trim(),
      shippingCity: checkout.shippingCity.trim(),
    },
    items: items.map((item) => ({
      name: item.type === "deal" ? `${item.name} (Deal)` : item.name,
      slug: item.slug,
      image: item.image,
      quantity: item.quantity,
      unitPrice: item.price,
      lineTotal: item.price * item.quantity,
      includedProducts:
        item.type === "deal" ? item.includedProducts : undefined,
    })),
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    discount: totals.discount,
    total: totals.total,
    couponCode,
  });

  return {
    success: true,
    order: {
      id: orderId,
      orderNumber,
      total: totals.total,
      paymentMethod: checkout.paymentMethod,
      emailSent: emailResult.sent,
    },
  };
}
