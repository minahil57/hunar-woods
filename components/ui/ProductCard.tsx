import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatProductPrice } from "@/lib/products/pricing";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </Link>

        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide rounded-md ${
              product.badge === "sale"
                ? "bg-red-600 text-white"
                : "bg-forest text-white"
            }`}
          >
            {product.badge === "sale" ? "Sale" : "New"}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-forest transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted mt-1">{product.material}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base font-semibold text-forest">
              {formatProductPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </Link>

        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
