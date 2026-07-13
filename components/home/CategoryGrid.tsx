import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-20 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Shop by Category" href="/products" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-forest/20 to-transparent" />
              <span className="absolute bottom-4 left-4 font-serif text-lg font-semibold text-white">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
