"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadCartFromStorage, saveCartToStorage } from "@/lib/cart/storage";
import type { CartItem } from "@/lib/cart/types";
import { COUPON_CODES } from "@/lib/cart/types";
import {
  calculateCartTotals,
  dealToCartItem,
  getCartLineKey,
  productToCartItem,
} from "@/lib/cart/utils";
import type { Deal, Product } from "@/lib/types";
import { hasProductPrice } from "@/lib/products/pricing";

interface CartContextValue {
  items: CartItem[];
  couponCode: string | null;
  isHydrated: boolean;
  totals: ReturnType<typeof calculateCartTotals>;
  addItem: (product: Product, quantity?: number) => void;
  addDeal: (deal: Deal, quantity?: number) => void;
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCartFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveCartToStorage(items);
  }, [items, isHydrated]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    if (!hasProductPrice(product)) return;

    setItems((current) => {
      const nextItem = productToCartItem(product, quantity);
      const lineKey = getCartLineKey(nextItem);
      const existing = current.find((item) => getCartLineKey(item) === lineKey);

      if (existing) {
        return current.map((item) =>
          getCartLineKey(item) === lineKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...current, nextItem];
    });
  }, []);

  const addDeal = useCallback((deal: Deal, quantity = 1) => {
    setItems((current) => {
      const nextItem = dealToCartItem(deal, quantity);
      const lineKey = getCartLineKey(nextItem);
      const existing = current.find((item) => getCartLineKey(item) === lineKey);

      if (existing) {
        return current.map((item) =>
          getCartLineKey(item) === lineKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...current, nextItem];
    });
  }, []);

  const removeItem = useCallback((lineKey: string) => {
    setItems((current) =>
      current.filter((item) => getCartLineKey(item) !== lineKey)
    );
  }, []);

  const updateQuantity = useCallback((lineKey: string, quantity: number) => {
    if (quantity < 1) {
      setItems((current) =>
        current.filter((item) => getCartLineKey(item) !== lineKey)
      );
      return;
    }

    setItems((current) =>
      current.map((item) =>
        getCartLineKey(item) === lineKey ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode(null);
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();

    if (!COUPON_CODES[normalized]) {
      return false;
    }

    setCouponCode(normalized);
    return true;
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode(null);
  }, []);

  const totals = useMemo(
    () => calculateCartTotals(items, couponCode),
    [items, couponCode]
  );

  const value = useMemo(
    () => ({
      items,
      couponCode,
      isHydrated,
      totals,
      addItem,
      addDeal,
      removeItem,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
    }),
    [
      items,
      couponCode,
      isHydrated,
      totals,
      addItem,
      addDeal,
      removeItem,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
