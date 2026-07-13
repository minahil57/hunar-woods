import type { CartItem, CartTotals } from "@/lib/cart/types";
import {
  COUPON_CODES,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from "@/lib/cart/types";
import type { Deal } from "@/lib/types";
import type { Product } from "@/lib/types";
import { hasProductPrice } from "@/lib/products/pricing";

export function getCartLineKey(item: CartItem): string {
  return item.type === "deal" ? `deal:${item.dealId}` : `product:${item.productId}`;
}

export function productToCartItem(
  product: Product,
  quantity = 1
): CartItem {
  if (!hasProductPrice(product)) {
    throw new Error("Cannot add a product without a price to the cart.");
  }

  return {
    type: "product",
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity,
  };
}

export function dealToCartItem(deal: Deal, quantity = 1): CartItem {
  return {
    type: "deal",
    dealId: deal.id,
    slug: deal.slug,
    name: deal.title,
    price: deal.totalDealPrice,
    image: deal.image,
    quantity,
    includedProducts: deal.products.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
    })),
  };
}

export function getCartItemHref(item: CartItem): string {
  return item.type === "deal" ? `/deals/${item.slug}` : `/products/${item.slug}`;
}

export function calculateCartTotals(
  items: CartItem[],
  couponCode?: string | null
): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const coupon = couponCode?.trim().toUpperCase();
  const discountPercent = coupon ? COUPON_CODES[coupon]?.percent ?? 0 : 0;
  const discount = Math.round((subtotal * discountPercent) / 100);
  const afterDiscount = subtotal - discount;
  const shipping =
    afterDiscount >= FREE_SHIPPING_THRESHOLD || afterDiscount === 0
      ? 0
      : SHIPPING_COST;

  return {
    itemCount,
    subtotal,
    discount,
    shipping,
    total: afterDiscount + shipping,
  };
}
