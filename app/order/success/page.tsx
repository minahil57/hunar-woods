import Link from "next/link";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_URL } from "@/lib/data/contact";
import { formatPrice } from "@/lib/utils/format";

interface OrderSuccessPageProps {
  searchParams: Promise<{
    number?: string;
    total?: string;
    payment?: string;
    email?: string;
    sent?: string;
  }>;
}

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  bank_transfer: "Bank Transfer",
  card: "Credit / Debit Card",
};

export const metadata = {
  title: "Order Confirmed | Hunar Woods",
};

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const { number, total, payment, email, sent } = await searchParams;
  const orderNumber = number ?? "—";
  const orderTotal = total ? Number(total) : null;
  const paymentLabel = payment ? PAYMENT_LABELS[payment] ?? payment : null;
  const customerEmail = email ? decodeURIComponent(email) : null;
  const emailSent = sent === "1";

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-b from-cream to-white min-h-[70vh]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <CheckoutProgress current="confirmation" />

        <div className="text-center mt-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-forest text-white text-3xl mb-6 shadow-lg shadow-forest/20 ring-4 ring-forest/10">
            ✓
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
            Order Confirmed!
          </h1>
          <p className="text-muted mt-4 leading-relaxed max-w-md mx-auto">
            Thank you for choosing Hunar Woods.
            {emailSent && customerEmail ? (
              <>
                {" "}
                A confirmation email with your products and order details has
                been sent to{" "}
                <span className="font-medium text-forest">{customerEmail}</span>.
              </>
            ) : (
              " We'll reach out shortly to confirm your delivery schedule."
            )}
          </p>
        </div>

        <div className="mt-10 bg-white rounded-2xl border border-border shadow-[0_8px_32px_rgba(30,58,47,0.06)] overflow-hidden">
          <div className="bg-section-dark px-6 py-4">
            <p className="text-gold text-xs font-semibold uppercase tracking-wider">
              Order Details
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted">Order Number</span>
              <span className="font-semibold text-forest text-lg">{orderNumber}</span>
            </div>
            {customerEmail && (
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted">Confirmation sent to</span>
                <span className="font-medium text-sm">{customerEmail}</span>
              </div>
            )}
            {orderTotal !== null && !Number.isNaN(orderTotal) && (
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted">Total</span>
                <span className="font-semibold text-lg">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            )}
            {paymentLabel && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted">Payment Method</span>
                <span className="font-medium">{paymentLabel}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          {[
            { icon: "📧", text: "Confirmation email on the way" },
            { icon: "📞", text: "We'll call to schedule delivery" },
            { icon: "🚚", text: "5–10 business days delivery" },
          ].map((item) => (
            <div
              key={item.text}
              className="p-4 rounded-xl bg-white border border-border text-xs text-muted"
            >
              <span className="text-lg block mb-2" aria-hidden>
                {item.icon}
              </span>
              {item.text}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/products" variant="primary" size="lg" className="!rounded-xl">
            Continue Shopping
          </Button>
          <Button href="/" variant="ghost" size="lg" className="!rounded-xl">
            Back to Home
          </Button>
        </div>

        <p className="text-xs text-muted text-center mt-8">
          Questions?{" "}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest font-medium hover:underline"
          >
            Contact our team
          </a>
        </p>
      </div>
    </section>
  );
}
