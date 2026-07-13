import type { Product } from "@/lib/types";

function getSiteUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return url || undefined;
}

export function buildProductWhatsAppMessage(product: Product): string {
  const siteUrl = getSiteUrl();
  const lines = [
    "Hello! I'm interested in the following product from Hunar Woods:",
    "",
    `Product: ${product.name}`,
    `Category: ${product.category}`,
    `Material: ${product.material}`,
  ];

  if (product.color) lines.push(`Color: ${product.color}`);
  if (product.size) lines.push(`Size: ${product.size}`);
  if (product.roomType) lines.push(`Room: ${product.roomType}`);

  if (product.shortDescription) {
    lines.push("", `Details: ${product.shortDescription}`);
  }

  if (siteUrl) {
    lines.push("", `Link: ${siteUrl}/products/${product.slug}`);
  }

  lines.push("", "Please share the price and availability.");

  return lines.join("\n");
}

export function getProductWhatsAppUrl(product: Product): string {
  return getWhatsAppUrl(buildProductWhatsAppMessage(product));
}

export const WHATSAPP_PHONE = "923333653290";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hello! I'm interested in Hunar Woods furniture. I would like to know more.";

export const WHATSAPP_PROJECT_MESSAGE =
  "Hello! I'd like to discuss a custom furniture project with Hunar Woods.";

export function getWhatsAppUrl(
  message: string = WHATSAPP_DEFAULT_MESSAGE
): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_URL = getWhatsAppUrl();
export const WHATSAPP_PROJECT_URL = getWhatsAppUrl(WHATSAPP_PROJECT_MESSAGE);

export function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}
