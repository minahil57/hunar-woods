import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FeaturedProductCard } from "@/components/home/FeaturedProductCard";
import type { Product } from "@/lib/types";

interface HeroSectionProps {
  featuredProduct?: Product | null;
}

export function HeroSection({ featuredProduct }: HeroSectionProps) {
  return (
    <section className="relative min-h-[520px] lg:min-h-[640px] flex items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=1080&fit=crop"
        alt="Modern handmade furniture collection"
        fill
        priority
        className="object-cover scale-[1.02]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/90 via-forest-dark/65 to-forest/25" />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-96 rounded-full bg-white/5 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="max-w-xl animate-[fadeUp_0.7s_ease-out]">
            <p className="text-gold font-medium text-sm uppercase tracking-widest mb-4">
              Flat 30–50% Off
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
              Modern Handmade Furniture Collection
            </h1>
            <p className="mt-5 text-white/80 text-base sm:text-lg leading-relaxed max-w-md">
              Discover premium solid wood furniture handcrafted by skilled
              artisans. Timeless design, natural materials, and lasting quality
              for every room in your home.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/products" variant="primary" size="lg">
                Shop Now
              </Button>
              <Button href="/deals" variant="outline" size="lg">
                Explore Deals
              </Button>
            </div>
          </div>

          {featuredProduct && (
            <div className="hidden lg:flex justify-end animate-[fadeUp_0.8s_ease-out_both]">
              <FeaturedProductCard product={featuredProduct} />
            </div>
          )}
        </div>

        {featuredProduct && (
          <div className="lg:hidden mt-10 flex justify-center animate-[fadeUp_0.7s_ease-out]">
            <FeaturedProductCard product={featuredProduct} />
          </div>
        )}
      </div>
    </section>
  );
}
