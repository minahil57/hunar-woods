import type { NavLink } from "@/lib/types";
import { WHATSAPP_URL } from "@/lib/data/contact";

export const mainNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Deals", href: "/deals" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: WHATSAPP_URL },
];

export const footerCustomerLinks: NavLink[] = [
  { label: "Contact Us", href: WHATSAPP_URL },
];

export const footerShopLinks: NavLink[] = [
  { label: "All Products", href: "/products" },
  { label: "Deals", href: "/deals" },
  { label: "Best Sellers", href: "/products?collection=best-sellers" },
  { label: "New Arrivals", href: "/products?collection=new-arrivals" },
];

export const footerAboutLinks: NavLink[] = [
  { label: "About Us", href: "/about" },
];

export const footerQuickLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/hunarwoods?igsh=bjJ3a3U2azdzbHBn", icon: "instagram" as const },
];
