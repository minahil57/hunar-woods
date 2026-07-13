import Link from "next/link";

interface ProductsHeroProps {
  title: string;
  description: string;
  breadcrumbs: { label: string; href?: string }[];
  productCount?: number;
}

export function ProductsHero({
  title,
  description,
  breadcrumbs,
  productCount,
}: ProductsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-forest">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,165,116,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(45,90,71,0.4),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-white/60">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-gold transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gold font-medium">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              ✦ Handmade Luxury Furniture
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
              {title}
            </h1>
            <p className="mt-4 text-white/75 text-base lg:text-lg leading-relaxed max-w-xl">
              {description}
            </p>
          </div>

          <div className="flex gap-6 lg:gap-10 shrink-0">
            <div className="text-center lg:text-right">
              <p className="text-2xl lg:text-3xl font-serif font-semibold text-gold">
                100%
              </p>
              <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">
                Solid Wood
              </p>
            </div>
            <div className="w-px bg-white/20 hidden sm:block" />
            <div className="text-center lg:text-right">
              <p className="text-2xl lg:text-3xl font-serif font-semibold text-gold">
                {productCount ?? "—"}
              </p>
              <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">
                Products
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
