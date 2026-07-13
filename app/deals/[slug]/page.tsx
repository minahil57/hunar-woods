import Link from "next/link";
import { notFound } from "next/navigation";
import { DealDetail } from "@/components/deals/DealDetail";
import { DealCard } from "@/components/deals/DealCard";
import { dealTypeLabel, getDealBySlug, getDeals } from "@/lib/deals/queries";

interface DealPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DealPageProps) {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);

  if (!deal) {
    return { title: "Deal Not Found | Hunar Woods" };
  }

  return {
    title: `${deal.title} | Hunar Woods Deals`,
    description:
      deal.shortDescription ??
      `Shop ${deal.title} — limited-time offer on premium handmade furniture.`,
  };
}

export default async function DealPage({ params }: DealPageProps) {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);

  if (!deal) {
    notFound();
  }

  const allDeals = await getDeals();
  const otherDeals = allDeals
    .filter((item) => item.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-forest">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,165,116,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(45,90,71,0.35),transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-white/55">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li>
                <Link href="/deals" className="hover:text-gold transition-colors">
                  Deals
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li className="text-gold font-medium truncate max-w-[240px] sm:max-w-none">
                {deal.title}
              </li>
            </ol>
          </nav>

          <p className="text-gold text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] mt-6 mb-2">
            ✦ {dealTypeLabel(deal.dealType)}
          </p>
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight max-w-3xl">
            {deal.title}
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-16 bg-gradient-to-b from-cream to-cream-dark/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DealDetail deal={deal} />
        </div>
      </section>

      {otherDeals.length > 0 && (
        <section className="py-10 lg:py-14 bg-white border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                More Deals
              </h2>
              <Link
                href="/deals"
                className="text-sm text-gold-dark font-medium hover:text-forest transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {otherDeals.map((item) => (
                <DealCard key={item.id} deal={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
