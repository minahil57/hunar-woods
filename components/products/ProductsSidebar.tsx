"use client";

import Image from "next/image";
import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/data/contact";
import { usePathname, useSearchParams } from "next/navigation";
import { getRoomBySlug } from "@/lib/data/rooms";
import { buildProductsUrl } from "@/lib/products/url";
import type { ProductCollection, ProductSort } from "@/lib/products/types";
import type { Category } from "@/lib/types";

interface ProductsSidebarProps {
  categories: Category[];
  activeCategory?: string;
  activeRoomSlug?: string;
  activeCollection?: ProductCollection;
  activeSort?: ProductSort;
  searchQuery?: string;
}

export function ProductsSidebar({
  categories,
  activeCategory,
  activeRoomSlug,
  activeCollection = "all",
  activeSort = "newest",
  searchQuery,
}: ProductsSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const roomFromUrl = searchParams.get("room") ?? activeRoomSlug;
  const queryFromUrl = searchParams.get("q") ?? searchQuery;
  const activeRoom = getRoomBySlug(roomFromUrl);

  function categoryHref(slug?: string) {
    const base = slug ? `/categories/${slug}` : "/products";
    return buildProductsUrl({
      basePath: base,
      room: roomFromUrl,
      collection: activeCollection,
      sort: activeSort,
      q: queryFromUrl ?? undefined,
    });
  }

  return (
    <aside className="lg:col-span-3 space-y-4">
      {activeRoom && (
        <div className="rounded-xl bg-forest/5 border border-forest/15 px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Room
            </p>
            <p className="text-sm font-semibold text-forest">{activeRoom.name}</p>
          </div>
          <Link
            href={buildProductsUrl({
              collection: activeCollection,
              sort: activeSort,
              q: queryFromUrl ?? undefined,
            })}
            className="text-xs text-muted hover:text-forest transition-colors shrink-0"
          >
            Clear
          </Link>
        </div>
      )}

      <div className="lg:hidden -mx-4 px-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
          Browse by Category
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <CategoryChip
            href={categoryHref()}
            label="All"
            image={null}
            active={!activeCategory && pathname === "/products"}
          />
          {categories.map((category) => (
            <CategoryChip
              key={category.slug}
              href={categoryHref(category.slug)}
              label={category.name}
              image={category.image}
              active={activeCategory === category.slug}
            />
          ))}
        </div>
      </div>

      <div className="hidden lg:block sticky top-20">
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="bg-forest px-5 py-4">
            <h2 className="font-serif text-lg font-semibold text-white">
              Categories
            </h2>
            <p className="text-white/60 text-xs mt-1">
              Filter by furniture type
            </p>
          </div>

          <ul className="p-3 space-y-0.5 max-h-[calc(100vh-12rem)] overflow-y-auto">
            <li>
              <SidebarLink
                href={categoryHref()}
                label="All Products"
                active={!activeCategory && pathname === "/products"}
              />
            </li>
            {categories.map((category) => (
              <li key={category.slug}>
                <SidebarLink
                  href={categoryHref(category.slug)}
                  label={category.name}
                  image={category.image}
                  active={activeCategory === category.slug}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 p-5">
          <p className="font-serif text-sm font-semibold text-forest">
            Custom Furniture
          </p>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Need a bespoke piece? We craft custom sizes and designs tailored to
            your space.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs font-semibold text-gold-dark hover:text-forest transition-colors"
          >
            Get in touch →
          </a>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  image,
  active,
}: {
  href: string;
  label: string;
  image?: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
        active
          ? "bg-cream text-forest font-semibold shadow-sm ring-1 ring-gold/30"
          : "text-muted hover:text-forest hover:bg-cream/70"
      }`}
    >
      {image && (
        <span className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 ring-1 ring-border">
          <Image src={image} alt="" fill className="object-cover" sizes="36px" />
        </span>
      )}
      <span className={!image ? "pl-1" : undefined}>{label}</span>
      {active && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
      )}
    </Link>
  );
}

function CategoryChip({
  href,
  label,
  image,
  active,
}: {
  href: string;
  label: string;
  image: string | null;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
        active
          ? "bg-forest text-white shadow-md"
          : "bg-white text-muted border border-border hover:border-forest/30 hover:text-forest"
      }`}
    >
      {image && (
        <span className="relative w-5 h-5 rounded-full overflow-hidden hidden sm:block">
          <Image src={image} alt="" fill className="object-cover" sizes="20px" />
        </span>
      )}
      {label}
    </Link>
  );
}
