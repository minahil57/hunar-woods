import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductSection } from "@/components/home/ProductSection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { RoomGrid } from "@/components/home/RoomGrid";
import { ValueProps } from "@/components/home/ValueProps";
import { getCategories } from "@/lib/categories/queries";
import { getBestSellers, getFeaturedProduct, getNewArrivals } from "@/lib/products/queries";

export const revalidate = 60;

export default async function Home() {
  const [categories, bestSellers, newArrivals, featuredProduct] =
    await Promise.all([
      getCategories(),
      getBestSellers(4),
      getNewArrivals(4),
      getFeaturedProduct(),
    ]);

  return (
    <>
      <HeroSection featuredProduct={featuredProduct} />
      <CategoryGrid categories={categories} />
      <RoomGrid />
      <PromoBanner />
      <ProductSection
        title="Best Sellers"
        href="/products?collection=best-sellers"
        products={bestSellers}
      />
      <ProductSection
        title="New Arrivals"
        href="/products?collection=new-arrivals"
        products={newArrivals}
      />
      <ValueProps />
    </>
  );
}
