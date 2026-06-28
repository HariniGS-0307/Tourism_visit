import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

// Cache all destinations for 5 minutes (no filter)
const getAllDestinations = unstable_cache(
  async () =>
    prisma.destination.findMany({
      include: {
        _count: {
          select: { listings: { where: { status: "PUBLISHED" } } },
        },
      },
      orderBy: { name: "asc" },
    }),
  ["all-destinations"],
  { revalidate: 300 }
);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const search = searchParams.get("search");

    // Use cached response when no filters applied
    if (!region && !search) {
      const destinations = await getAllDestinations();
      return NextResponse.json(destinations, {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
      });
    }

    const where: Prisma.DestinationWhereInput = {};

    if (region && search) {
      // Both filters: AND-combine them
      where.AND = [
        {
          OR: [
            { region: { contains: region, mode: "insensitive" } },
            { district: { contains: region, mode: "insensitive" } },
          ],
        },
        {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
      ];
    } else if (region) {
      where.OR = [
        { region: { contains: region, mode: "insensitive" } },
        { district: { contains: region, mode: "insensitive" } },
      ];
    } else if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const destinations = await prisma.destination.findMany({
      where,
      include: {
        _count: {
          select: { listings: { where: { status: "PUBLISHED" } } },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
