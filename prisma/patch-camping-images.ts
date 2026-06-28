/**
 * Patches camping-related destinations with vivid, place-specific hero images.
 * Run: npx tsx prisma/patch-camping-images.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CAMPING_IMAGES: Record<string, string> = {
  // Bhandardara — Arthur Lake starcamp / lakeside tent camping at night
  bhandardara:
    "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=1200&q=85",

  // Igatpuri — misty Sahyadri valley campsite in monsoon greenery
  igatpuri:
    "https://images.unsplash.com/photo-1504280390367-361c6d9d38f4?w=1200&q=85",

  // Pench National Park — jungle forest camp / wildlife tents
  "pench-national-park":
    "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=1200&q=85",

  // Vengurla — beachside camping on Konkan coast at sunset
  vengurla:
    "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?w=1200&q=85",

  // Harishchandragad — high-altitude fortress camp under stars
  harishchandragad:
    "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200&q=85",
};

async function main() {
  let updated = 0;

  for (const [slug, heroImageUrl] of Object.entries(CAMPING_IMAGES)) {
    const result = await prisma.destination.updateMany({
      where: { slug },
      data: { heroImageUrl },
    });
    if (result.count > 0) {
      console.log(`✅ Updated camping image: ${slug}`);
      updated++;
    } else {
      console.log(`⚠️  Not found in DB: ${slug}`);
    }
  }

  console.log(`\nDone. Updated ${updated} destinations.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
