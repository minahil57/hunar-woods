import type { CartItem } from "@/lib/cart/types";

const CART_STORAGE_KEY = "hunar-woods-cart";

function normalizeCartItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;

  if (item.type === "deal") {
    if (
      typeof item.dealId !== "string" ||
      typeof item.slug !== "string" ||
      typeof item.name !== "string" ||
      typeof item.price !== "number" ||
      typeof item.image !== "string" ||
      typeof item.quantity !== "number"
    ) {
      return null;
    }

    const includedProducts = Array.isArray(item.includedProducts)
      ? item.includedProducts
          .filter(
            (entry): entry is { name: string; quantity: number } =>
              !!entry &&
              typeof entry === "object" &&
              typeof (entry as { name?: unknown }).name === "string" &&
              typeof (entry as { quantity?: unknown }).quantity === "number"
          )
          .map((entry) => ({
            name: entry.name,
            quantity: entry.quantity,
          }))
      : [];

    return {
      type: "deal",
      dealId: item.dealId,
      slug: item.slug,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      includedProducts,
    };
  }

  const productId =
    typeof item.productId === "string"
      ? item.productId
      : typeof item.id === "string"
        ? item.id
        : null;

  if (
    !productId ||
    typeof item.slug !== "string" ||
    typeof item.name !== "string" ||
    typeof item.price !== "number" ||
    typeof item.image !== "string" ||
    typeof item.quantity !== "number"
  ) {
    return null;
  }

  if (item.dealId) {
    return null;
  }

  return {
    type: "product",
    productId,
    slug: item.slug,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
  };
}

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(normalizeCartItem)
      .filter((item): item is CartItem => item !== null);
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
