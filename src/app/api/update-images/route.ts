import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const updates = [
      { name: "Bhandardara", img: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&q=85" },
      { name: "Igatpuri", img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80" },

      { name: "Harishchandragad", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=85" },
      { name: "Vengurla", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85" },
      { name: "Mulshi Lake", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85" },
      { name: "Karjat", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85" },
      { name: "Pench National Park", img: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80" },
    ];

    let updatedListings = 0;

    // 1. Update Destinations
    for (const u of updates) {
      await prisma.destination.updateMany({
        where: { name: { contains: u.name, mode: "insensitive" } },
        data: { heroImageUrl: u.img }
      });
    }

    // 2. Update specific listings to have good camping images if they exist
    const campingImage = "https://images.unsplash.com/photo-1478131143088-4e6c210e2e58?w=1200&q=85";

    const campingCategory = await prisma.category.findFirst({
      where: { name: { contains: "Camping", mode: "insensitive" } }
    });

    if (campingCategory) {
      const result = await prisma.listing.updateMany({
        where: { categoryId: campingCategory.id },
        data: { images: [campingImage] }
      });
      updatedListings += result.count;
    }

    return NextResponse.json({ success: true, message: `Updated images for destinations and ${updatedListings} camping listings!` });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
