"use client";

import Image from "next/image";
import { useState } from "react";
import {
  hasProductVideo,
  parseProductVideoUrl,
  type ProductVideoSource,
} from "@/lib/products/video";
import type { Product } from "@/lib/types";

interface ProductVideoProps {
  product: Product;
}

export function ProductVideo({ product }: ProductVideoProps) {
  const source = parseProductVideoUrl(product.videoUrl);
  if (!source) return null;

  return (
    <section
      className="mt-16 lg:mt-24"
      aria-labelledby="product-video-heading"
    >
      <div className="relative overflow-hidden rounded-[1.75rem] border border-forest/10 bg-gradient-to-br from-forest via-forest to-forest-dark shadow-[0_24px_80px_rgba(30,58,47,0.22)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(196,165,116,0.35), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08), transparent 40%)",
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:p-10 xl:p-12">
          <div className="lg:col-span-4 xl:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
              Product Film
            </p>
            <h2
              id="product-video-heading"
              className="mt-3 font-serif text-2xl font-semibold leading-tight text-white sm:text-3xl"
            >
              See the craftsmanship
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-[15px]">
              Watch how {product.name} is shaped, finished, and brought to life
              by our artisans — from raw timber to a piece made for your home.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/80">
                HD Preview
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/80">
                {product.material}
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            <VideoPlayer source={source} poster={product.image} title={product.name} />
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoPlayer({
  source,
  poster,
  title,
}: {
  source: ProductVideoSource;
  poster: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(source.type === "file");

  if (source.type === "file") {
    return (
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
        <div className="relative aspect-video">
          <video
            className="h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={poster}
            aria-label={`${title} product video`}
          >
            <source src={source.src} />
            Your browser does not support embedded video.
          </video>
        </div>
      </div>
    );
  }

  if (playing) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
        <div className="relative aspect-video">
          <iframe
            src={`${source.embedUrl}&autoplay=1`}
            title={`${title} video`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-transform duration-300 hover:scale-[1.01]"
      aria-label={`Play video for ${title}`}
    >
      <div className="relative aspect-video">
        <Image
          src={poster}
          alt=""
          fill
          className="object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-65"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-forest shadow-xl transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
            <PlayIcon />
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
              Tap to play
            </p>
            <p className="mt-1 font-serif text-lg text-white sm:text-xl">
              {title}
            </p>
          </div>
          <span className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/80 backdrop-blur-sm">
            {source.type === "youtube" ? "YouTube" : "Vimeo"}
          </span>
        </div>
      </div>
    </button>
  );
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8"
      aria-hidden
    >
      <path d="M8 5.14v13.72c0 .79.87 1.27 1.54.84l11.02-6.86c.6-.37.6-1.3 0-1.67L9.54 4.3C8.87 3.87 8 4.35 8 5.14z" />
    </svg>
  );
}

export { hasProductVideo };
