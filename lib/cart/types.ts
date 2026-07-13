export interface CartProductItem {
  type: "product";
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartDealIncludedProduct {
  name: string;
  quantity: number;
}

export interface CartDealItem {
  type: "deal";
  dealId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  includedProducts: CartDealIncludedProduct[];
}

export type CartItem = CartProductItem | CartDealItem;

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export const FREE_SHIPPING_THRESHOLD = 50_000;
export const SHIPPING_COST = 2_500;

export const COUPON_CODES: Record<string, { label: string; percent: number }> = {
  HUNAR10: { label: "10% off", percent: 10 },
};
