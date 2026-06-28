import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

export default async function LegacyListingRedirect({
  params,
}: {
  params: { slug: string; listingSlug: string };
}) {
  const listing = await prisma.listing.findFirst({
    where: { slug: params.listingSlug },
    select: { id: true },
  });

  if (!listing) {
    notFound();
  }

  redirect(`/listings/${listing.id}`);
}
