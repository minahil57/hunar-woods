interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={`skeleton-shimmer rounded-lg ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <article className="flex flex-col bg-white rounded-xl overflow-hidden border border-border/60">
      <Skeleton className="aspect-square rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-10 w-full mt-2 rounded-lg" />
      </div>
    </article>
  );
}
