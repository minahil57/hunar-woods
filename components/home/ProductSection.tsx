import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/lib/types";

interface ProductSectionProps {
  title: string;
  href: string;
  products: Product[];
}

export function ProductSection({ title, href, products }: ProductSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-20 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} href={href} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
