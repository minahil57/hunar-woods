import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { rooms } from "@/lib/data/rooms";

export function RoomGrid() {
  return (
    <section className="py-16 lg:py-20 bg-cream-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Shop by Room" href="/products" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {rooms.map((room) => (
            <Link
              key={room.slug}
              href={`/products?room=${room.slug}`}
              className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-xl overflow-hidden"
            >
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-forest/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="font-serif text-xl font-semibold text-white">
                  {room.name}
                </h3>
                <p className="text-sm text-white/70 mt-1">{room.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
