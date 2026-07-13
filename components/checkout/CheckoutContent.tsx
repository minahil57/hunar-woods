"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/cart-context";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart/types";
import { placeOrder } from "@/lib/orders/actions";
import type { PaymentMethod } from "@/lib/orders/types";
import { formatPrice } from "@/lib/utils/format";
import { getCartLineKey } from "@/lib/cart/utils";

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay when your order arrives at your doorstep",
    icon: "💵",
  },
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    description: "Transfer details will be sent to your email",
    icon: "🏦",
  },
  {
    value: "card",
    label: "Credit / Debit Card",
    description: "We will contact you to complete payment",
    icon: "💳",
  },
];

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Other"];

export function CheckoutContent() {
  const router = useRouter();
  const { items, couponCode, totals, isHydrated, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    shippingCity: "Karachi",
    shippingNotes: "",
    paymentMethod: "cod" as PaymentMethod,
  });

  if (!isHydrated) {
    return (
      <div className="py-24 flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-forest border-t-transparent animate-spin" />
        <p className="text-muted text-sm">Preparing checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <CheckoutProgress current="checkout" />
        <div className="py-16 text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cream-dark flex items-center justify-center text-3xl">
            📦
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
            Nothing to checkout
          </h2>
          <p className="text-muted mt-3 leading-relaxed">
            Add handcrafted furniture to your cart before completing your order.
          </p>
          <Button href="/products" variant="primary" size="lg" className="mt-8 !rounded-xl">
            Shop Collection
          </Button>
        </div>
      </>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await placeOrder({
      items,
      couponCode,
      checkout: form,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    clearCart();
    router.push(
      `/order/success?number=${encodeURIComponent(result.order.orderNumber)}&total=${result.order.total}&payment=${result.order.paymentMethod}&email=${encodeURIComponent(form.customerEmail.trim())}&sent=${result.order.emailSent ? "1" : "0"}`
    );
  }

  return (
    <>
      <CheckoutProgress current="checkout" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10"
      >
        <div className="lg:col-span-2 space-y-6">
          <FormSection
            step={1}
            title="Contact Information"
            subtitle="How can we reach you about your order?"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Full Name"
                required
                value={form.customerName}
                onChange={(value) => setForm({ ...form, customerName: value })}
                placeholder="Your full name"
              />
              <Field
                label="Email Address"
                type="email"
                required
                value={form.customerEmail}
                onChange={(value) => setForm({ ...form, customerEmail: value })}
                placeholder="you@example.com"
              />
              <Field
                label="Phone Number"
                type="tel"
                required
                className="sm:col-span-2"
                value={form.customerPhone}
                onChange={(value) => setForm({ ...form, customerPhone: value })}
                placeholder="03XX XXXXXXX"
              />
            </div>
          </FormSection>

          <FormSection
            step={2}
            title="Shipping Address"
            subtitle="Where should we deliver your furniture?"
          >
            <div className="space-y-4">
              <Field
                label="Street Address"
                required
                value={form.shippingAddress}
                onChange={(value) => setForm({ ...form, shippingAddress: value })}
                placeholder="House no., street, area"
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.shippingCity}
                  onChange={(e) =>
                    setForm({ ...form, shippingCity: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Delivery Notes"
                value={form.shippingNotes}
                onChange={(value) => setForm({ ...form, shippingNotes: value })}
                placeholder="Gate code, floor, landmarks (optional)"
              />
            </div>
          </FormSection>

          <FormSection
            step={3}
            title="Payment Method"
            subtitle="Choose how you'd like to pay"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PAYMENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    form.paymentMethod === option.value
                      ? "border-forest bg-forest/5 shadow-sm ring-1 ring-forest/10"
                      : "border-border hover:border-forest/30 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={form.paymentMethod === option.value}
                    onChange={() =>
                      setForm({ ...form, paymentMethod: option.value })
                    }
                    className="sr-only"
                  />
                  <span className="text-2xl mb-2" aria-hidden>
                    {option.icon}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {option.label}
                  </span>
                  <span className="text-xs text-muted mt-1 leading-relaxed">
                    {option.description}
                  </span>
                  {form.paymentMethod === option.value && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-forest text-white text-xs flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </label>
              ))}
            </div>
          </FormSection>
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border shadow-[0_8px_32px_rgba(30,58,47,0.06)] overflow-hidden sticky top-24">
            <div className="bg-section-dark px-6 py-5 border-b border-white/10">
              <h2 className="font-serif text-xl font-semibold text-white">
                Your Order
              </h2>
              <p className="text-white/55 text-sm mt-1">
                {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
              </p>
            </div>

            <div className="p-6 max-h-[320px] overflow-y-auto">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={getCartLineKey(item)} className="flex gap-3">
                    <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-cream-dark ring-1 ring-border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-forest text-white text-[10px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                        {item.name}
                      </p>
                      {item.type === "deal" && (
                        <p className="text-[11px] text-gold-dark mt-0.5">
                          Deal package
                        </p>
                      )}
                      <p className="text-xs text-muted mt-0.5">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-foreground shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 pb-6 border-t border-border pt-5 space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-forest">
                  <span>Discount</span>
                  <span>−{formatPrice(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span>
                  {totals.shipping === 0 ? (
                    <span className="text-forest font-medium">Free</span>
                  ) : (
                    formatPrice(totals.shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between font-serif text-lg font-semibold text-foreground pt-4 border-t border-border">
                <span>Total</span>
                <span className="text-forest">{formatPrice(totals.total)}</span>
              </div>

              {totals.subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-muted pt-2">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - totals.subtotal)}{" "}
                  more for free delivery
                </p>
              )}

              {error && (
                <p className="text-sm text-red-600 mt-3 p-3 rounded-xl bg-red-50 border border-red-100">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-4 !rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : "Place Order →"}
              </Button>

              <p className="text-[10px] text-muted text-center mt-4 leading-relaxed">
                By placing your order, you agree to our terms. Your data is kept
                secure and never shared.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </>
  );
}

function FormSection({
  step,
  title,
  subtitle,
  children,
}: {
  step: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-border bg-cream/40 flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-white text-sm font-bold">
          {step}
        </span>
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-border text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-shadow"
      />
    </div>
  );
}
