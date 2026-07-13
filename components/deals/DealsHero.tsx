import Link from "next/link";

interface DealsHeroProps {
  dealCount: number;
}

export function DealsHero({ dealCount }: DealsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-forest">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,165,116,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(45,90,71,0.4),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-white/60">
            <li>
              <Link href="/" className="hover:text-gold transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-gold font-medium">Deals</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              ✦ Limited Time Offers
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
              Exclusive Deals &amp; Bundles
            </h1>
            <p className="mt-4 text-white/75 text-base lg:text-lg leading-relaxed max-w-xl">
              Save on handcrafted solid wood furniture — flash sales, room
              bundles, and seasonal offers curated for your home.
            </p>
          </div>

          <div className="flex gap-6 lg:gap-10 shrink-0">
            <div className="text-center lg:text-right">
              <p className="text-2xl lg:text-3xl font-serif font-semibold text-gold">
                {dealCount}
              </p>
              <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">
                Active Deals
              </p>
            </div>
            <div className="w-px bg-white/20 hidden sm:block" />
            <div className="text-center lg:text-right">
              <p className="text-2xl lg:text-3xl font-serif font-semibold text-gold">
                40%
              </p>
              <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">
                Up To Off
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
