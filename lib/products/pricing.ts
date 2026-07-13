import type { Product } from "@/lib/types";

export function hasProductPrice(
  product: Pick<Product, "price">
): product is Product & { price: number } {
  return product.price != null;
}

export function formatProductPrice(price: number | null): string {
  if (price == null) {
    return "Contact for price";
  }

  return `PKR ${price.toLocaleString("en-PK")}`;
}
