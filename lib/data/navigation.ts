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
  { label: "FAQs", href: "/faq" },
  { label: "Returns", href: "/returns" },
  { label: "Shipping", href: "/shipping" },
];

export const footerAboutLinks: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export const footerQuickLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" as const },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" as const },
  { label: "TikTok", href: "https://tiktok.com", icon: "tiktok" as const },
];
