import Link from "next/link";

const steps = [
  { label: "Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
  { label: "Confirmation", href: null },
] as const;

export function CheckoutProgress({
  current,
}: {
  current: "cart" | "checkout" | "confirmation";
}) {
  const currentIndex =
    current === "cart" ? 0 : current === "checkout" ? 1 : 2;

  return (
    <nav aria-label="Checkout progress" className="mb-10 lg:mb-12">
      <ol className="flex items-center justify-center gap-0 max-w-lg mx-auto">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={step.label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2 min-w-0">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    isComplete
                      ? "bg-forest text-white"
                      : isCurrent
                        ? "bg-gold text-forest-dark ring-4 ring-gold/25"
                        : "bg-cream-dark text-muted border border-border"
                  }`}
                >
                  {isComplete ? "✓" : index + 1}
                </span>
                {step.href && !isCurrent ? (
                  <Link
                    href={step.href}
                    className={`text-xs font-medium truncate ${
                      isComplete ? "text-forest" : "text-muted hover:text-forest"
                    }`}
                  >
                    {step.label}
                  </Link>
                ) : (
                  <span
                    className={`text-xs font-medium truncate ${
                      isCurrent ? "text-forest font-semibold" : "text-muted"
                    }`}
                  >
                    {step.label}
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-px flex-1 mx-2 sm:mx-4 mb-6 ${
                    index < currentIndex ? "bg-forest" : "bg-border"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
