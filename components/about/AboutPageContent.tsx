import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  aboutClosing,
  aboutCustom,
  aboutHero,
  aboutLocation,
  aboutOfferings,
  aboutStory,
  aboutVisionMission,
  aboutWhyChoose,
} from "@/lib/data/about";
import { WHATSAPP_PROJECT_URL, WHATSAPP_URL } from "@/lib/data/contact";

export function AboutPageContent() {
  return (
    <>
      <section className="relative min-h-[420px] lg:min-h-[520px] flex items-end overflow-hidden">
        <Image
          src={aboutHero.image}
          alt={aboutHero.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/95 via-forest/70 to-forest/30" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/60">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-gold font-medium">About Us</li>
            </ol>
          </nav>

          <p className="text-gold text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            ✦ {aboutHero.subtitle}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight max-w-3xl">
            {aboutHero.title}
          </h1>
          <p className="mt-4 text-white/75 text-base lg:text-lg leading-relaxed max-w-2xl">
            {aboutHero.description}
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-gradient-to-b from-cream to-cream-dark/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={aboutStory.image}
                alt={aboutStory.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div>
              <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                Since 2022
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
                {aboutStory.title}
              </h2>
              <div className="mt-6 space-y-4 text-muted leading-relaxed">
                {aboutStory.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                Bespoke Craftsmanship
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
                {aboutCustom.title}
              </h2>
              <p className="mt-6 text-muted leading-relaxed">
                {aboutCustom.description}
              </p>
              <Button href={WHATSAPP_PROJECT_URL} variant="ghost" size="lg" className="mt-8 !rounded-xl">
                Discuss Your Project →
              </Button>
            </div>

            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl order-1 lg:order-2">
              <Image
                src={aboutCustom.image}
                alt={aboutCustom.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-section-dark border-y border-gold/30 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3">
              What Drives Us
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white">
              Vision &amp; Mission
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {aboutVisionMission.map((item) => (
              <article
                key={item.label}
                className="bg-promo-card-bg rounded-2xl p-8 lg:p-10 border border-promo-card-border"
              >
                <h3 className="font-serif text-2xl font-semibold text-gold">
                  {item.label}
                </h3>
                <p className="mt-4 text-white/70 leading-relaxed">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
            <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Our Collections
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
              What We Offer
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutOfferings.map((item) => (
              <article
                key={item.title}
                className="group bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}

            <article className="flex flex-col justify-center rounded-2xl bg-forest p-8 lg:p-10 text-white">
              <h3 className="font-serif text-2xl font-semibold text-gold">
                Why Choose Hunar Woods
              </h3>
              <ul className="mt-5 space-y-3">
                {aboutWhyChoose.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-white/80">
                    <span className="mt-0.5 text-gold shrink-0" aria-hidden>
                      ✦
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-white border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={aboutLocation.image}
                alt={aboutLocation.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div>
              <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                Karachi, Pakistan
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
                {aboutLocation.title}
              </h2>
              <p className="mt-6 text-muted leading-relaxed text-lg">
                {aboutLocation.address}
              </p>
              <p className="mt-6 text-muted leading-relaxed">{aboutClosing}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/products" variant="primary" size="lg" className="!rounded-xl">
                  Explore Collection
                </Button>
                <Button href={WHATSAPP_URL} variant="ghost" size="lg" className="!rounded-xl">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
