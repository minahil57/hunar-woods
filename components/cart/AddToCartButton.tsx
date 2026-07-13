"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { getProductWhatsAppUrl } from "@/lib/data/contact";
import { hasProductPrice } from "@/lib/products/pricing";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

const baseClassName =
  "mt-4 w-full py-2.5 rounded-lg text-sm font-medium transition-colors";

export function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!hasProductPrice(product)) {
    return (
      <a
        href={getProductWhatsAppUrl(product)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClassName} inline-flex items-center justify-center bg-[#25D366] text-white hover:bg-[#1ebe57] ${className}`}
      >
        Contact on WhatsApp
      </a>
    );
  }

  function handleClick() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={product.inStock === false}
      className={`${baseClassName} bg-forest-light/15 text-forest hover:bg-forest hover:text-white disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
