import { categories as fallbackCategories } from "@/lib/data/categories";
import { createServerClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

function mapCategory(row: {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    image:
      row.image_url ??
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop",
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createServerClient();

  if (!supabase) {
    return fallbackCategories;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[categories] Supabase fetch failed:", error.message);
    return fallbackCategories;
  }

  if (!data?.length) {
    return [];
  }

  return data.map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createServerClient();

  if (!supabase) {
    return fallbackCategories.find((category) => category.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[categories] Supabase fetch by slug failed:", error.message);
    return fallbackCategories.find((category) => category.slug === slug) ?? null;
  }

  if (!data) {
    return null;
  }

  return mapCategory(data);
}
