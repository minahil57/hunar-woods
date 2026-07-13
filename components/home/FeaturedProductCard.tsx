import Image from "next/image";
import Link from "next/link";
import { formatProductPrice } from "@/lib/products/pricing";
import type { Product } from "@/lib/types";

interface FeaturedProductCardProps {
  product: Product;
}

export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative block w-full max-w-[380px] overflow-hidden rounded-[1.75rem] bg-cream shadow-[0_24px_60px_rgba(22,43,34,0.35)] ring-1 ring-white/40 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_32px_80px_rgba(22,43,34,0.45)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 1024px) 90vw, 380px"
          priority
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-forest-dark/25 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/25 to-transparent"
          aria-hidden
        />

        <div className="absolute left-5 top-5 flex items-center gap-2">
          <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-forest-dark shadow-sm">
            Featured
          </span>
          {product.badge === "sale" && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-red-700">
              Sale
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">
            {product.category}
          </p>
          <h3 className="mt-2 font-serif text-[1.65rem] font-semibold leading-[1.15] text-white sm:text-[1.85rem]">
            {product.name}
          </h3>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">
                {product.price != null ? "From" : "Pricing"}
              </p>
              <p className="mt-0.5 text-lg font-semibold text-white">
                {formatProductPrice(product.price)}
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-forest shadow-lg transition-all duration-300 group-hover:bg-gold group-hover:text-forest-dark">
              View
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border/70 bg-cream px-5 py-3.5">
        <p className="truncate text-xs text-muted">
          {[product.material, product.color].filter(Boolean).join(" · ") ||
            "Handcrafted solid wood"}
        </p>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-dark">
          Exclusive
        </span>
      </div>
    </Link>
  );
}
