import type { Room } from "@/lib/types";

export const rooms: Room[] = [
  {
    name: "Living Room",
    slug: "living-room",
    roomType: "Living Room",
    description: "Center Tables, TV Consoles, Shelves",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop",
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    roomType: "Bedroom",
    description: "Bed Sets",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop",
  },
  {
    name: "Office",
    slug: "office",
    roomType: "Office",
    description: "Work Desks, Office Chairs",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
  },
  {
    name: "Entryway",
    slug: "entryway",
    roomType: "Entryway",
    description: "Lobby Consoles",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop",
  },
];

export function getRoomBySlug(slug?: string): Room | undefined {
  if (!slug) return undefined;
  return rooms.find((room) => room.slug === slug);
}

export function parseRoomSlug(value?: string): string | undefined {
  if (!value) return undefined;
  return getRoomBySlug(value) ? value : undefined;
}
