import Image from "next/image";
import { valueProps } from "@/lib/data/products";
import type { ValueProp } from "@/lib/types";

const iconMap: Record<ValueProp["icon"], string> = {
  wood: "/images/icons/value-props/wood.png",
  handcrafted: "/images/icons/value-props/hammer.png",
  delivery: "/images/icons/value-props/truck.png",
  returns: "/images/icons/value-props/returns.png",
  rating: "/images/icons/value-props/star.png",
};

export function ValueProps() {
  return (
    <section className="py-10 lg:py-12 bg-cream-dark border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 xl:gap-8">
          {valueProps.map((prop) => (
            <ValuePropItem key={prop.title} prop={prop} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuePropItem({ prop }: { prop: ValueProp }) {
  return (
    <div className="flex items-center gap-3 lg:gap-3.5">
      <div className="relative shrink-0 w-10 h-10 sm:w-11 sm:h-11">
        <Image
          src={iconMap[prop.icon]}
          alt=""
          fill
          className="object-contain"
          sizes="44px"
        />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm sm:text-[15px] font-semibold text-forest leading-snug">
          {prop.title}
        </h3>
        <p className="text-xs text-muted mt-0.5 leading-snug">{prop.description}</p>
      </div>
    </div>
  );
}
