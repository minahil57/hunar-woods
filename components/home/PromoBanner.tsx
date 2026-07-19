import Image from "next/image";
import Link from "next/link";

const cardClassName =
  "bg-promo-card-bg rounded-xl p-6 lg:p-8 border border-promo-card-border flex flex-col min-h-[220px]";

export function PromoBanner() {
  return (
    <section className="bg-section-dark border-t border-gold py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          <div className={cardClassName}>
            <span className="inline-block self-start bg-gold text-forest-dark text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-sm mb-5">
              Flash Sale
            </span>
            <h3 className="font-serif text-[1.65rem] lg:text-[1.75rem] font-semibold text-white leading-snug">
              Up to 40% Off Selected Items
            </h3>
            <p className="text-white/55 text-sm mt-3 leading-relaxed">
              Limited time offers on premium pieces
            </p>
            <Link
              href="/deals"
              className="mt-auto pt-6 text-gold text-sm font-medium hover:text-gold-light transition-colors"
            >
              Shop Flash Sale →
            </Link>
          </div>

          <div className={cardClassName}>
            <h3 className="font-serif text-[1.65rem] lg:text-[1.75rem] font-semibold text-white leading-snug">
              Bundle &amp; Save
            </h3>
            <p className="text-white/55 text-sm mt-3 leading-relaxed flex-1">
              Complete room sets starting from PKR 1,20,000 — Save up to 25%
            </p>
            <Link
              href="/deals"
              className="mt-auto inline-flex h-10 items-center justify-center gap-1.5 self-start rounded-full border border-white/20 bg-forest-dark/80 px-5 text-sm font-medium leading-none text-white transition-colors hover:bg-forest-dark"
            >
              <span>View Bundles</span>
              <span aria-hidden="true" className="text-[15px] leading-none">
                →
              </span>
            </Link>
          </div>

          <div className={cardClassName}>
            <div className="relative w-10 h-10 mb-5 shrink-0">
              <Image
                src="/images/icons/value-props/truck.png"
                alt=""
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <h3 className="font-serif text-[1.65rem] lg:text-[1.75rem] font-semibold text-white leading-snug">
              Free Delivery On Orders 50k+
            </h3>
            <p className="text-white/55 text-sm mt-3 leading-relaxed">
              Karachi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
