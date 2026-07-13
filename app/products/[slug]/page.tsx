import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/ProductDetail";
import { ProductSection } from "@/components/home/ProductSection";
import { getProducts, getProductBySlug } from "@/lib/products/queries";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | Hunar Woods" };
  }

  return {
    title: `${product.name} | Hunar Woods`,
    description:
      product.shortDescription ??
      `Shop ${product.name} — premium handmade solid wood furniture from Hunar Woods.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts({ limit: 20 });
  const relatedProducts = allProducts
    .filter((item) => item.category === product.category && item.slug !== slug)
    .slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-forest">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,165,116,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(45,90,71,0.35),transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-white/55">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-gold transition-colors"
                >
                  Products
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li>
                <Link
                  href={`/products?category=${encodeURIComponent(product.category.toLowerCase().replace(/\s+/g, "-"))}`}
                  className="hover:text-gold transition-colors"
                >
                  {product.category}
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li className="text-gold font-medium truncate max-w-[200px] sm:max-w-none">
                {product.name}
              </li>
            </ol>
          </nav>

          <p className="text-gold text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] mt-6 mb-2">
            ✦ {product.category}
          </p>
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight max-w-3xl">
            {product.name}
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-16 bg-gradient-to-b from-cream to-cream-dark/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductDetail product={product} />
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <ProductSection
          title="You May Also Like"
          href="/products"
          products={relatedProducts}
        />
      )}
    </>
  );
}
