import type { Product, ValueProp } from "@/lib/types";

/** Static fallback when Supabase is not configured */
export const bestSellers: Product[] = [
  {
    id: "1",
    name: "Ohio Work Desk",
    slug: "ohio-work-desk",
    category: "Work Desks",
    material: "Solid Wood",
    price: 45000,
    badge: "new",
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=600&fit=crop",
    roomType: "Office",
  },
  {
    id: "2",
    name: "Retro Lounge Chair",
    slug: "retro-lounge-chair",
    category: "Chairs",
    material: "Handcrafted",
    price: 32000,
    originalPrice: 40000,
    badge: "sale",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=600&fit=crop",
    roomType: "Living Room",
  },
  {
    id: "3",
    name: "Heritage Coffee Table",
    slug: "heritage-coffee-table",
    category: "Center Tables",
    material: "Solid Wood",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&h=600&fit=crop",
    roomType: "Living Room",
  },
  {
    id: "4",
    name: "Classic TV Console",
    slug: "classic-tv-console",
    category: "TV Consoles",
    material: "Handcrafted",
    price: 55000,
    badge: "new",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=600&fit=crop",
    roomType: "Living Room",
  },
];

export const newArrivals: Product[] = [
  {
    id: "5",
    name: "Artisan Writing Desk",
    slug: "artisan-writing-desk",
    category: "Work Desks",
    material: "Solid Wood",
    price: 52000,
    badge: "new",
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=600&fit=crop",
    roomType: "Office",
  },
  {
    id: "6",
    name: "Oak Dining Chair",
    slug: "oak-dining-chair",
    category: "Chairs",
    material: "Handcrafted",
    price: 18500,
    badge: "new",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=600&fit=crop",
    roomType: "Kitchen & Dining",
  },
  {
    id: "7",
    name: "Floating Wall Shelf",
    slug: "floating-wall-shelf",
    category: "Shelves",
    material: "Solid Wood",
    price: 12000,
    badge: "new",
    image:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&h=600&fit=crop",
    roomType: "Living Room",
  },
  {
    id: "8",
    name: "Grand Bed Set",
    slug: "grand-bed-set",
    category: "Bed Sets",
    material: "Handcrafted",
    price: 125000,
    badge: "new",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068feab?w=600&h=600&fit=crop",
    roomType: "Bedroom",
  },
  {
    id: "9",
    name: "Heritage Lobby Console",
    slug: "heritage-lobby-console",
    category: "Lobby Consoles",
    material: "Solid Wood",
    price: 38000,
    badge: "new",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=600&fit=crop",
    roomType: "Entryway",
  },
];

export const valueProps: ValueProp[] = [
  {
    icon: "wood",
    title: "100% Solid Wood",
    description: "Custom MDF and Plywood",
  },
  {
    icon: "handcrafted",
    title: "Handcrafted",
    description: "By Skilled Artisans",
  },
  {
    icon: "delivery",
    title: "Free Delivery",
    description: "Orders over PKR 50K",
  },
  {
    icon: "returns",
    title: "Easy Returns",
    description: "30-Day Policy",
  },
  {
    icon: "rating",
    title: "5-Star Rated",
    description: "2000+ Happy Customers",
  },
];

