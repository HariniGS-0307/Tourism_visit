import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Testing database connection...");

  try {
    // Test 1: Count destinations
    const destinationsCount = await prisma.destination.count();
    console.log("✅ Destinations count:", destinationsCount);

    // Test 2: Get first 3 destinations
    const destinations = await prisma.destination.findMany({ take: 3 });
    console.log("✅ Destinations found:", destinations);

    // Test 3: Count published listings
    const listingsCount = await prisma.listing.count({
      where: { status: "PUBLISHED" },
    });
    console.log("✅ Published listings count:", listingsCount);

    // Test 4: Get first 3 published listings
    const listings = await prisma.listing.findMany({
      where: { status: "PUBLISHED" },
      take: 3,
      include: { destination: true, category: true },
    });
    console.log("✅ Listings found:", listings);
  } catch (err) {
    console.error("❌ Database error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
