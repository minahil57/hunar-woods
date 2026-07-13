"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-visible scrollbar-hide lg:w-[88px] shrink-0">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative w-20 h-20 lg:w-full lg:aspect-square shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                activeIndex === index
                  ? "border-forest shadow-md ring-2 ring-forest/15"
                  : "border-border hover:border-forest/40 opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${product.name} view ${index + 1}`}
                fill
                className="object-cover"
                sizes="88px"
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 min-w-0">
        <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-cream-dark to-cream border border-border shadow-[0_8px_40px_rgba(30,58,47,0.08)]">
          <Image
            src={images[activeIndex]}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 1024px) 100vw, 45vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/10 via-transparent to-transparent pointer-events-none" />

          {product.badge && (
            <span
              className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm ${
                product.badge === "sale"
                  ? "bg-red-600 text-white"
                  : "bg-forest text-white"
              }`}
            >
              {product.badge === "sale" ? "Sale" : product.badge}
            </span>
          )}
        </div>

        {images.length > 1 && (
          <p className="mt-3 text-center text-xs text-muted">
            {activeIndex + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  );
}
