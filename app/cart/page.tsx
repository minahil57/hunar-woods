import Link from "next/link";
import { CartPageContent } from "@/components/cart/CartPageContent";

export const metadata = {
  title: "Shopping Cart | Hunar Woods",
  description: "Review your selected furniture pieces before checkout.",
};

export default function CartPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-section-dark border-b border-gold/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,165,116,0.1),transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            Your Selection
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
            Shopping Cart
          </h1>
          <p className="text-white/60 mt-3 max-w-lg text-sm sm:text-base">
            Review your handcrafted pieces before completing your order.
          </p>
          <Link
            href="/products"
            className="inline-block mt-5 text-sm text-gold hover:text-gold-light transition-colors font-medium"
          >
            ← Continue Shopping
          </Link>
        </div>
      </section>

      <section className="py-10 lg:py-14 bg-gradient-to-b from-cream to-white min-h-[60vh]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CartPageContent />
        </div>
      </section>
    </>
  );
}
