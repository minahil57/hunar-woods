"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductVideo } from "@/components/products/ProductVideo";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/cart-context";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart/types";
import { getProductWhatsAppUrl } from "@/lib/data/contact";
import { formatProductPrice, hasProductPrice } from "@/lib/products/pricing";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
}

type Tab = "description" | "specs" | "shipping";

const TRUST_POINTS = [
  { icon: "🌿", label: "100% Solid Wood" },
  { icon: "🔨", label: "Handcrafted" },
  { icon: "🚚", label: "Free Delivery 50k+" },
];

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("description");

  const inStock = product.inStock !== false;
  const priced = hasProductPrice(product);
  const savings =
    priced &&
    product.originalPrice &&
    product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  function handleAddToCart() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem(product, quantity);
    router.push("/checkout");
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
        <ProductGallery product={product} />

        <div className="lg:sticky lg:top-24">
          <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em]">
            {product.category}
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl xl:text-[2.75rem] font-semibold text-foreground leading-[1.15] mt-2">
            {product.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-semibold text-forest">
              {formatProductPrice(product.price)}
            </span>
            {priced && product.originalPrice && (
              <span className="text-lg text-muted line-through pb-0.5">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {savings > 0 && (
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-md bg-red-50 text-red-700 border border-red-100">
                Save {formatPrice(savings)}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                inStock
                  ? "bg-forest/10 text-forest"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  inStock ? "bg-forest" : "bg-red-500"
                }`}
              />
              {inStock ? "In Stock — Ready to Ship" : "Out of Stock"}
            </span>
          </div>

          {product.shortDescription && (
            <p className="mt-6 text-muted leading-relaxed text-[15px] border-l-2 border-gold pl-4">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-6 grid grid-cols-3 gap-3">
            {TRUST_POINTS.map((point) => (
              <div
                key={point.label}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-border shadow-sm"
              >
                <span className="text-lg" aria-hidden>
                  {point.icon}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-forest mt-1.5 leading-tight">
                  {point.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-white border border-border shadow-sm">
            {priced ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-foreground">
                    Quantity
                  </span>
                  <div className="inline-flex items-center rounded-xl border border-border bg-cream/50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 flex items-center justify-center text-forest hover:bg-cream transition-colors text-lg"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-12 text-center text-base font-semibold border-x border-border py-2.5">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-11 h-11 flex items-center justify-center text-forest hover:bg-cream transition-colors text-lg"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    className="w-full !rounded-xl"
                    onClick={handleAddToCart}
                    disabled={!inStock}
                  >
                    {added ? "Added to Cart ✓" : "Add to Cart"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="w-full !rounded-xl"
                    onClick={handleBuyNow}
                    disabled={!inStock}
                  >
                    Buy Now
                  </Button>
                </div>

                <p className="text-xs text-muted text-center mt-4">
                  Free delivery on orders over{" "}
                  {formatPrice(FREE_SHIPPING_THRESHOLD)}
                </p>
              </>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted leading-relaxed">
                  This piece is priced on request. Contact us on WhatsApp and
                  we&apos;ll share pricing and availability for your order.
                </p>
                <Button
                  href={getProductWhatsAppUrl(product)}
                  variant="primary"
                  size="lg"
                  className="w-full mt-5 !rounded-xl !bg-[#25D366] hover:!bg-[#1ebe57] !text-white"
                >
                  Contact on WhatsApp
                </Button>
              </div>
            )}
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
            <Spec label="Material" value={product.material} />
            {product.color ? (
              <Spec label="Color" value={product.color} />
            ) : (
              <Spec label="Finish" value="Natural Wood" />
            )}
            {product.size && <Spec label="Size" value={product.size} />}
            {product.roomType && <Spec label="Room" value={product.roomType} />}
          </dl>
        </div>
      </div>

      <ProductVideo product={product} />

      <div className="mt-16 lg:mt-20">
        <div className="border-b border-border">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {(
              [
                { id: "description", label: "Description" },
                { id: "specs", label: "Specifications" },
                { id: "shipping", label: "Shipping & Returns" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-forest text-forest"
                    : "border-transparent text-muted hover:text-forest"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="py-8 lg:py-10 max-w-3xl">
          {activeTab === "description" && (
            <div className="animate-[fadeUp_0.4s_ease-out]">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                About This Piece
              </h2>
              <p className="text-muted leading-relaxed whitespace-pre-line text-[15px]">
                {product.description ||
                  `${product.name} is handcrafted from premium solid wood by skilled artisans. Each piece is built to last for generations with timeless design and natural materials.`}
              </p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="animate-[fadeUp_0.4s_ease-out]">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-5">
                Specifications
              </h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  <SpecRow label="Product Name" value={product.name} />
                  <SpecRow label="Category" value={product.category} />
                  <SpecRow label="Material" value={product.material} />
                  {product.color && (
                    <SpecRow label="Color" value={product.color} />
                  )}
                  {product.size && <SpecRow label="Size" value={product.size} />}
                  {product.roomType && (
                    <SpecRow label="Room Type" value={product.roomType} />
                  )}
                  <SpecRow
                    label="Availability"
                    value={inStock ? "In Stock" : "Out of Stock"}
                  />
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="animate-[fadeUp_0.4s_ease-out] space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  Delivery
                </h2>
                <p className="text-muted leading-relaxed text-[15px]">
                  Free delivery on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
                  Standard delivery across Karachi, Lahore, and Islamabad within
                  5–10 business days. Our team will contact you to schedule
                  delivery.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  Returns
                </h3>
                <p className="text-muted leading-relaxed text-[15px]">
                  30-day hassle-free return policy on unused items in original
                  packaging. Custom pieces may have different terms — contact us
                  for details.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-border p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted truncate">{product.name}</p>
            <p className="font-semibold text-forest">
              {formatProductPrice(product.price)}
            </p>
          </div>
          {priced ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="shrink-0 !rounded-xl"
            >
              {added ? "Added ✓" : "Add to Cart"}
            </Button>
          ) : (
            <Button
              href={getProductWhatsAppUrl(product)}
              variant="primary"
              size="md"
              className="shrink-0 !rounded-xl !bg-[#25D366] hover:!bg-[#1ebe57] !text-white"
            >
              WhatsApp
            </Button>
          )}
        </div>
      </div>

      <div className="h-20 lg:hidden" aria-hidden />
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4">
      <dt className="text-xs text-muted uppercase tracking-wider">{label}</dt>
      <dd className="font-medium text-foreground mt-1">{value}</dd>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td className="py-3 pr-6 text-muted w-1/3">{label}</td>
      <td className="py-3 font-medium text-foreground">{value}</td>
    </tr>
  );
}
