import type { Metadata } from "next";
import { ProductsListing } from "@/components/products/ProductsListing";
import { getCategories } from "@/lib/categories/queries";
import { getRoomBySlug, parseRoomSlug } from "@/lib/data/rooms";
import { parseProductCollection, parseProductSort } from "@/lib/products/queries";
import { collectionLabel } from "@/lib/products/types";

export const metadata: Metadata = {
  title: "Products | Hunar Woods",
  description:
    "Shop premium handmade solid wood furniture. Browse work desks, chairs, tables, bed sets, and more.",
};

export const revalidate = 60;

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    collection?: string;
    room?: string;
    q?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const sort = parseProductSort(params.sort);
  const collection = parseProductCollection(params.collection);
  const roomSlug = parseRoomSlug(params.room);
  const activeRoom = getRoomBySlug(roomSlug);
  const searchQuery = params.q?.trim() || undefined;

  const categories = await getCategories();
  const activeCategory = categories.find((c) => c.slug === categorySlug);

  const pageTitle = searchQuery
    ? `Search: "${searchQuery}"`
    : activeCategory
      ? activeCategory.name
      : activeRoom
        ? activeRoom.name
        : collectionLabel(collection);

  const pageDescription = searchQuery
    ? `Showing products matching "${searchQuery}".`
    : activeCategory
    ? `Browse our ${activeCategory.name.toLowerCase()} collection — premium handmade solid wood furniture crafted for modern living.`
    : activeRoom
      ? `Furniture curated for your ${activeRoom.name.toLowerCase()} — ${activeRoom.description.toLowerCase()}.`
      : collection === "best-sellers"
        ? "Our most loved handmade furniture pieces, chosen by customers across Pakistan."
        : collection === "new-arrivals"
          ? "Fresh additions to our collection — newly crafted solid wood furniture for your home."
          : undefined;

  return (
    <ProductsListing
      categories={categories}
      activeCategory={categorySlug}
      activeSort={sort}
      activeCollection={collection}
      activeRoomSlug={roomSlug}
      searchQuery={searchQuery}
      title={pageTitle}
      description={pageDescription}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Products", href: categorySlug || roomSlug || searchQuery ? "/products" : undefined },
        ...(searchQuery ? [{ label: `Search: ${searchQuery}` }] : []),
        ...(activeRoom && !searchQuery ? [{ label: activeRoom.name }] : []),
        ...(activeCategory ? [{ label: activeCategory.name }] : []),
      ]}
    />
  );
}
