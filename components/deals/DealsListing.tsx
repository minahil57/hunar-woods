import { DealCard } from "@/components/deals/DealCard";
import { DealsHero } from "@/components/deals/DealsHero";
import type { Deal } from "@/lib/types";

interface DealsListingProps {
  deals: Deal[];
}

export function DealsListing({ deals }: DealsListingProps) {
  return (
    <>
      <DealsHero dealCount={deals.length} />

      <section className="py-10 lg:py-16 bg-gradient-to-b from-cream to-cream-dark/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {deals.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <p className="font-serif text-2xl font-semibold text-foreground">
                No active deals right now
              </p>
              <p className="text-muted mt-3 leading-relaxed">
                Check back soon for flash sales and bundle offers on premium
                furniture.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground">
                    Current Offers
                  </h2>
                  <p className="text-muted text-sm mt-1">
                    Handpicked savings on solid wood furniture
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
