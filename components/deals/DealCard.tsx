import Image from "next/image";
import Link from "next/link";
import { dealTypeLabel, formatDealEndsAt } from "@/lib/deals/queries";
import { formatPrice } from "@/lib/utils/format";
import type { Deal } from "@/lib/types";

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  const endsLabel = formatDealEndsAt(deal.endsAt);

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border/60">
      <Link href={`/deals/${deal.slug}`} className="relative aspect-[16/10] overflow-hidden bg-cream-dark">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-forest/10 to-transparent" />

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {deal.badge && (
            <span className="inline-block bg-gold text-forest-dark text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-sm">
              {deal.badge}
            </span>
          )}
          <span className="inline-block bg-white/90 text-forest text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-sm">
            {dealTypeLabel(deal.dealType)}
          </span>
        </div>

        {endsLabel && (
          <span className="absolute top-4 right-4 bg-forest/90 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
            {endsLabel}
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-5 lg:p-6">
        <Link href={`/deals/${deal.slug}`}>
          <h3 className="font-serif text-xl lg:text-2xl font-semibold text-foreground group-hover:text-forest transition-colors leading-snug">
            {deal.title}
          </h3>
          {deal.shortDescription && (
            <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2">
              {deal.shortDescription}
            </p>
          )}
        </Link>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider">Deal price</p>
            <p className="text-xl font-semibold text-forest">
              {formatPrice(deal.totalDealPrice)}
            </p>
          </div>
          {deal.savings > 0 && (
            <>
              <span className="text-sm text-muted line-through pb-0.5">
                {formatPrice(deal.totalOriginalPrice)}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md bg-red-50 text-red-700 border border-red-100">
                Save {deal.savingsPercent}%
              </span>
            </>
          )}
        </div>

        <div className="mt-auto pt-5 flex flex-col items-center text-center gap-3">
          <p className="text-xs text-muted">
            {deal.products.length}{" "}
            {deal.products.length === 1 ? "item" : "items"} included
          </p>

          <Link
            href={`/deals/${deal.slug}`}
            className="w-full inline-flex h-10 items-center justify-center rounded-xl bg-forest text-white text-sm font-medium hover:bg-forest-dark transition-colors"
          >
            View Deal →
          </Link>
        </div>
      </div>
    </article>
  );
}
