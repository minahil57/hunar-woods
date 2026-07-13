"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/cart-context";
import { dealTypeLabel, formatDealEndsAt } from "@/lib/deals/queries";
import { formatPrice } from "@/lib/utils/format";
import type { Deal, DealProduct } from "@/lib/types";

interface DealDetailProps {
  deal: Deal;
}

function DealProductRow({ item }: { item: DealProduct }) {
  return (
    <article className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-2xl border border-border shadow-sm">
      <Link
        href={`/products/${item.product.slug}`}
        className="relative w-full sm:w-36 h-36 shrink-0 rounded-xl overflow-hidden bg-cream-dark"
      >
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="144px"
        />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <div>
            <Link
              href={`/products/${item.product.slug}`}
              className="font-serif text-lg sm:text-xl font-semibold text-foreground hover:text-forest transition-colors"
            >
              {item.product.name}
            </Link>
            <p className="text-sm text-muted mt-1">{item.product.material}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted mt-1">Qty: {item.quantity}</p>
            )}
          </div>

          <div className="sm:text-right shrink-0">
            <span className="inline-flex items-center rounded-full bg-cream px-3 py-1 text-xs font-medium text-forest">
              Included in deal
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Link
            href={`/products/${item.product.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium text-foreground hover:border-forest hover:text-forest transition-colors"
          >
            View Product
          </Link>
        </div>
      </div>
    </article>
  );
}

export function DealDetail({ deal }: DealDetailProps) {
  const router = useRouter();
  const { addDeal } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const endsLabel = formatDealEndsAt(deal.endsAt);

  function handleAddToCart() {
    addDeal(deal, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addDeal(deal, quantity);
    router.push("/checkout");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-dark shadow-lg">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {deal.badge && (
          <span className="absolute top-4 left-4 inline-block bg-gold text-forest-dark text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-sm">
            {deal.badge}
          </span>
        )}
      </div>

      <div className="lg:sticky lg:top-24">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em]">
            {dealTypeLabel(deal.dealType)}
          </span>
          {endsLabel && (
            <span className="text-xs font-medium text-red-700 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
              {endsLabel}
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-[1.15]">
          {deal.title}
        </h1>

        {deal.description && (
          <p className="mt-4 text-muted leading-relaxed">{deal.description}</p>
        )}

        <div className="mt-6 flex flex-wrap items-end gap-3">
          <span className="text-3xl font-semibold text-forest">
            {formatPrice(deal.totalDealPrice)}
          </span>
          {deal.savings > 0 && (
            <>
              <span className="text-lg text-muted line-through pb-0.5">
                {formatPrice(deal.totalOriginalPrice)}
              </span>
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-md bg-red-50 text-red-700 border border-red-100">
                Save {formatPrice(deal.savings)} ({deal.savingsPercent}%)
              </span>
            </>
          )}
        </div>

        <p className="text-sm text-muted mt-3">
          One deal price — includes {deal.products.length}{" "}
          {deal.products.length === 1 ? "product" : "products"}
        </p>

        <div className="mt-6 inline-flex items-center rounded-xl border border-border bg-cream/40 overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-forest hover:bg-cream transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-12 text-center text-sm font-semibold border-x border-border py-2">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-forest hover:bg-cream transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="!rounded-xl flex-1"
            onClick={handleAddToCart}
          >
            {added ? "Deal Added ✓" : "Add Deal to Cart"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="!rounded-xl flex-1 !border-forest !text-forest hover:!bg-forest hover:!text-white"
            onClick={handleBuyNow}
          >
            Buy Deal Now
          </Button>
        </div>

        <div className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
            What&apos;s included
          </h2>
          <div className="space-y-4">
            {deal.products.map((item) => (
              <DealProductRow key={item.product.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
