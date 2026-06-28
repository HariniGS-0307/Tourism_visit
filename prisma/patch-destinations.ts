/**
 * Patches existing destinations with coordinates and metadata
 * without wiping the full database. Run: npx tsx prisma/patch-destinations.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PATCHES: Record<string, {
  latitude: number;
  longitude: number;
  district: string;
  region: string;
  bestSeason: string;
  difficultyTags: string[];
  heroImageUrl: string;
}> = {
  lonavala: {
    latitude: 18.7548, longitude: 73.4062, district: "Pune", region: "Western Ghats",
    bestSeason: "Monsoon (Jun–Sep)", difficultyTags: ["Easy", "Family Friendly"],
    heroImageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
  },
  bhandardara: {
    latitude: 19.5403, longitude: 73.7543, district: "Ahmednagar", region: "Western Ghats",
    bestSeason: "Winter (Oct–Feb)", difficultyTags: ["Moderate", "Camping"],
    heroImageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  "kaas-plateau": {
    latitude: 17.7175, longitude: 73.8847, district: "Satara", region: "Western Ghats",
    bestSeason: "Monsoon (Aug–Sep)", difficultyTags: ["Easy", "Nature Walk"],
    heroImageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  "harihar-fort": {
    latitude: 19.9053, longitude: 73.4451, district: "Nashik", region: "Western Ghats",
    bestSeason: "Winter (Nov–Feb)", difficultyTags: ["Difficult", "Trekking"],
    heroImageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  },
  tarkarli: {
    latitude: 16.0244, longitude: 73.461, district: "Sindhudurg", region: "Konkan Coast",
    bestSeason: "Winter (Oct–Mar)", difficultyTags: ["Easy", "Water Sports"],
    heroImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
  matheran: {
    latitude: 18.9869, longitude: 73.2653, district: "Raigad", region: "Western Ghats",
    bestSeason: "Monsoon (Jun–Sep)", difficultyTags: ["Easy", "Family Friendly"],
    heroImageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
  },
  rajmachi: {
    latitude: 18.8278, longitude: 73.3895, district: "Pune", region: "Western Ghats",
    bestSeason: "Monsoon (Jun–Sep)", difficultyTags: ["Moderate", "Trekking"],
    heroImageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  },
  igatpuri: {
    latitude: 19.695, longitude: 73.5592, district: "Nashik", region: "Western Ghats",
    bestSeason: "Monsoon (Jun–Sep)", difficultyTags: ["Moderate", "Trekking"],
    heroImageUrl: "https://images.unsplash.com/photo-1439068794076-944eafa2a0f0?w=800&q=80",
  },
  karjat: {
    latitude: 18.9104, longitude: 73.3237, district: "Raigad", region: "Western Ghats",
    bestSeason: "Monsoon (Jun–Sep)", difficultyTags: ["Moderate", "Camping"],
    heroImageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
  },
  "malshej-ghat": {
    latitude: 19.34, longitude: 73.745, district: "Pune", region: "Western Ghats",
    bestSeason: "Monsoon (Jul–Sep)", difficultyTags: ["Easy", "Scenic Drive"],
    heroImageUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
  },
};

async function main() {
  for (const [slug, data] of Object.entries(PATCHES)) {
    await prisma.destination.updateMany({
      where: { slug },
      data,
    });
    console.log(`Updated ${slug}`);
  }
  console.log("Done patching destinations.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
