import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";

export const metadata: Metadata = {
  title: "About Us | Hunar Woods",
  description:
    "Learn about Hunar Woods — Karachi's premium handmade solid wood furniture brand. Craftsmanship, custom design, and luxury furniture since 2022.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
