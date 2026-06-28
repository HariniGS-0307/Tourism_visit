/**
 * Patches broken/missing images in the database.
 * Run: npx tsx prisma/patch-images.ts
 */
import { PrismaClient } from "@prisma/client";
import {
  DESTINATION_IMAGES,
  CATEGORY_IMAGES,
  LISTING_IMAGE_POOL,
  isBrokenImageUrl,
  getDestinationImage,
  getCategoryImage,
} from "../src/lib/images";

const prisma = new PrismaClient();

async function main() {
  const destinations = await prisma.destination.findMany();
  for (const dest of destinations) {
    const heroImageUrl = getDestinationImage(dest.slug, dest.heroImageUrl);
    await prisma.destination.update({
      where: { id: dest.id },
      data: {
        heroImageUrl,
        latitude: dest.latitude ?? DESTINATION_IMAGES[dest.slug] ? dest.latitude : dest.latitude,
      },
    });
    console.log(`Updated destination image: ${dest.name}`);
  }

  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    const icon = getCategoryImage(cat.slug, cat.icon);
    await prisma.category.update({
      where: { id: cat.id },
      data: { icon },
    });
    console.log(`Updated category image: ${cat.name}`);
  }

  const listings = await prisma.listing.findMany({
    include: { category: true, destination: true },
  });
  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    const current = listing.images?.[0];
    const image =
      current && !isBrokenImageUrl(current)
        ? current
        : LISTING_IMAGE_POOL[i % LISTING_IMAGE_POOL.length];

    await prisma.listing.update({
      where: { id: listing.id },
      data: { images: [image] },
    });
    console.log(`Updated listing image: ${listing.title}`);
  }

  console.log("All images patched successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
