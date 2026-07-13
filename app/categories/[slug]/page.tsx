import { notFound } from "next/navigation";
import { ProductsListing } from "@/components/products/ProductsListing";
import { getCategories, getCategoryBySlug } from "@/lib/categories/queries";
import { getRoomBySlug, parseRoomSlug } from "@/lib/data/rooms";
import { parseProductCollection, parseProductSort } from "@/lib/products/queries";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; collection?: string; room?: string; q?: string }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { sort: sortParam, collection: collectionParam, room: roomParam, q } =
    await searchParams;
  const sort = parseProductSort(sortParam);
  const collection = parseProductCollection(collectionParam);
  const roomSlug = parseRoomSlug(roomParam);
  const activeRoom = getRoomBySlug(roomSlug);
  const searchQuery = q?.trim() || undefined;

  const [category, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <ProductsListing
      categories={categories}
      activeCategory={slug}
      activeSort={sort}
      activeCollection={collection}
      activeRoomSlug={roomSlug}
      searchQuery={searchQuery}
      title={category.name}
      description={
        activeRoom
          ? `${category.name} for your ${activeRoom.name.toLowerCase()} — premium handmade solid wood furniture.`
          : `Discover our ${category.name.toLowerCase()} — handmade luxury solid wood furniture designed to elevate your home.`
      }
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        ...(activeRoom ? [{ label: activeRoom.name, href: `/products?room=${roomSlug}` }] : []),
        { label: category.name },
      ]}
    />
  );
}
