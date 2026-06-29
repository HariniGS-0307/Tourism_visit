import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const destination = searchParams.get("destination");
    const category = searchParams.get("category");
    const maxPrice = searchParams.get("maxPrice");
    const difficulty = searchParams.get("difficulty");
    const limit = searchParams.get("limit");

    const where: any = {
      status: "PUBLISHED",
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }
    
    if (destination) {
      where.destination = { slug: destination };
    }
    
    if (category) {
      where.category = { slug: category };
    }
    
    if (maxPrice) {
      where.pricePerPerson = { lte: parseFloat(maxPrice) };
    }
    
    if (difficulty) {
      where.difficultyLevel = difficulty;
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        category: true,
        destination: true,
        operator: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "OPERATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const profile = await prisma.operatorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile || profile.id !== body.operatorId) {
      return NextResponse.json({ error: "Invalid operator" }, { status: 403 });
    }

    const slug = `${body.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const listing = await prisma.listing.create({
      data: {
        title: body.title,
        slug: `${slug}-${Date.now()}`,
        operatorId: profile.id,
        categoryId: body.categoryId,
        destinationId: body.destinationId,
        shortDescription: body.shortDescription,
        fullDescription: body.fullDescription,
        pricePerPerson: body.pricePerPerson,
        groupSizeMin: body.groupSizeMin,
        groupSizeMax: body.groupSizeMax,
        difficultyLevel: body.difficultyLevel,
        status: body.status || "DRAFT",
        inclusions: ["Guide", "Safety Gear"],
        exclusions: ["Transport"],
        thingsToCarry: ["Water Bottle", "Comfortable Shoes"],
        images: ["https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"],
        durationDays: 1,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
