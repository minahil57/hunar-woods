import type { Metadata } from "next";
import { DealsListing } from "@/components/deals/DealsListing";
import { getDeals } from "@/lib/deals/queries";

export const metadata: Metadata = {
  title: "Deals & Offers | Hunar Woods",
  description:
    "Shop flash sales, bundles, and limited-time offers on premium handmade solid wood furniture.",
};

export const revalidate = 60;

export default async function DealsPage() {
  const deals = await getDeals();

  return <DealsListing deals={deals} />;
}
