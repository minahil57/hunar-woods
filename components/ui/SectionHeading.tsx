import Link from "next/link";

interface SectionHeadingProps {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeading({
  title,
  href,
  linkLabel = "See All",
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`flex items-end justify-between mb-8 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-semibold text-forest tracking-tight">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-forest hover:text-gold transition-colors underline-offset-4 hover:underline"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
