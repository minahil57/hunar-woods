"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/cart-context";
import { COUPON_CODES, FREE_SHIPPING_THRESHOLD } from "@/lib/cart/types";
import { formatPrice } from "@/lib/utils/format";
import { getCartItemHref, getCartLineKey } from "@/lib/cart/utils";

export function CartPageContent() {
  const {
    items,
    couponCode,
    totals,
    isHydrated,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  if (!isHydrated) {
    return (
      <div className="py-24 flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-forest border-t-transparent animate-spin" />
        <p className="text-muted text-sm">Loading your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <CheckoutProgress current="cart" />
        <div className="py-16 text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cream-dark flex items-center justify-center text-3xl">
            🛒
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
            Your cart is empty
          </h2>
          <p className="text-muted mt-3 leading-relaxed">
            Discover handcrafted solid wood furniture made to elevate every room
            in your home.
          </p>
          <Button href="/products" variant="primary" size="lg" className="mt-8 !rounded-xl">
            Explore Collection
          </Button>
        </div>
      </>
    );
  }

  function handleApplyCoupon() {
    if (!couponInput.trim()) return;

    const applied = applyCoupon(couponInput);
    if (applied) {
      setCouponError("");
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code. Try HUNAR10");
    }
  }

  const shippingProgress = Math.min(
    100,
    (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - totals.subtotal;

  return (
    <>
      <CheckoutProgress current="cart" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              {totals.itemCount} {totals.itemCount === 1 ? "Item" : "Items"}
            </h2>
            <Link
              href="/products"
              className="text-sm text-gold-dark font-medium hover:text-forest transition-colors"
            >
              Continue Shopping →
            </Link>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => {
              const lineKey = getCartLineKey(item);
              const href = getCartItemHref(item);

              return (
              <article
                key={lineKey}
                className="group flex gap-4 sm:gap-5 p-4 sm:p-5 bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <Link
                  href={href}
                  className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-cream-dark ring-1 ring-border"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="128px"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link
                        href={href}
                        className="font-serif text-lg sm:text-xl font-semibold text-foreground hover:text-forest transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      {item.type === "deal" && (
                        <>
                          <p className="text-xs text-gold-dark font-medium mt-1">
                            Deal package
                          </p>
                          {item.includedProducts.length > 0 && (
                            <ul className="text-xs text-muted mt-2 space-y-0.5">
                              {item.includedProducts.map((product) => (
                                <li key={product.name}>
                                  • {product.name}
                                  {product.quantity > 1
                                    ? ` × ${product.quantity}`
                                    : ""}
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                      <p className="text-forest font-semibold mt-1.5">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground text-lg shrink-0 hidden sm:block">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-xl border border-border bg-cream/40 overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(lineKey, item.quantity - 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-forest hover:bg-cream transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-10 text-center text-sm font-semibold border-x border-border py-2">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(lineKey, item.quantity + 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-forest hover:bg-cream transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-foreground sm:hidden">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(lineKey)}
                        className="text-sm text-muted hover:text-red-600 transition-colors underline-offset-2 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
            })}
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border shadow-[0_8px_32px_rgba(30,58,47,0.06)] overflow-hidden sticky top-24">
            <div className="bg-forest px-6 py-5">
              <h2 className="font-serif text-xl font-semibold text-white">
                Order Summary
              </h2>
              <p className="text-white/60 text-sm mt-1">
                Review before checkout
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-3 text-sm">
                <SummaryRow label="Subtotal" value={formatPrice(totals.subtotal)} />
                {totals.discount > 0 && (
                  <SummaryRow
                    label={`Discount${couponCode ? ` (${couponCode})` : ""}`}
                    value={`−${formatPrice(totals.discount)}`}
                    valueClassName="text-forest font-medium"
                  />
                )}
                <SummaryRow
                  label="Shipping"
                  value={
                    totals.shipping === 0 ? (
                      <span className="text-forest font-medium">Free</span>
                    ) : (
                      formatPrice(totals.shipping)
                    )
                  }
                />
              </div>

              {amountToFreeShipping > 0 && (
                <div className="mt-5 p-4 rounded-xl bg-cream/80 border border-border">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted">Free shipping progress</span>
                    <span className="font-medium text-forest">
                      {formatPrice(amountToFreeShipping)} to go
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="border-t border-border mt-5 pt-5 flex justify-between items-center">
                <span className="font-serif text-lg font-semibold">Total</span>
                <span className="text-2xl font-semibold text-forest">
                  {formatPrice(totals.total)}
                </span>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="coupon"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2"
                >
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    id="coupon"
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="HUNAR10"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm bg-cream/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 rounded-xl bg-forest text-white text-sm font-medium hover:bg-forest-light transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-600 mt-2">{couponError}</p>
                )}
                {couponCode && (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-gold-dark hover:text-forest mt-2 font-medium"
                  >
                    ✓ {COUPON_CODES[couponCode].label} applied — Remove
                  </button>
                )}
              </div>

              <Button
                href="/checkout"
                variant="primary"
                size="lg"
                className="w-full mt-6 !rounded-xl"
              >
                Proceed to Checkout →
              </Button>

              <div className="mt-5 flex items-center justify-center gap-4 text-[10px] text-muted uppercase tracking-wider">
                <span>🔒 Secure</span>
                <span>•</span>
                <span>🌿 Solid Wood</span>
                <span>•</span>
                <span>↩ 30-Day Returns</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function SummaryRow({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between text-muted">
      <span>{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}
