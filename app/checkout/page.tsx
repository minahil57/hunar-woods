import Link from "next/link";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";

export const metadata = {
  title: "Checkout | Hunar Woods",
  description: "Complete your furniture order with Hunar Woods.",
};

export default function CheckoutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-forest">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,165,116,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(45,90,71,0.4),transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            ✦ Secure Checkout
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
            Complete Your Order
          </h1>
          <p className="text-white/65 mt-3 max-w-lg text-sm sm:text-base">
            Just a few details and your handmade furniture will be on its way.
          </p>
          <Link
            href="/cart"
            className="inline-block mt-5 text-sm text-gold hover:text-gold-light transition-colors font-medium"
          >
            ← Back to Cart
          </Link>
        </div>
      </section>

      <section className="py-10 lg:py-14 bg-gradient-to-b from-cream to-white min-h-[70vh]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CheckoutContent />
        </div>
      </section>
    </>
  );
}
