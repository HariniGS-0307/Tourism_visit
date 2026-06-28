import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Missing listing ID" }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
        destination: true,
        operator: true,
        itineraryDays: {
          orderBy: { dayNumber: "asc" },
        },
        availabilitySlots: {
          where: { date: { gte: new Date() }, isActive: true },
          orderBy: { date: "asc" },
        },
        reviews: {
          include: {
            user: { select: { name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        }
      }
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "OPERATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { operator: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const profile = await prisma.operatorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile || listing.operatorId !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const updated = await prisma.listing.update({
      where: { id: params.id },
      data: {
        title: body.title,
        shortDescription: body.shortDescription,
        fullDescription: body.fullDescription,
        pricePerPerson: body.pricePerPerson,
        categoryId: body.categoryId,
        destinationId: body.destinationId,
        groupSizeMin: body.groupSizeMin,
        groupSizeMax: body.groupSizeMax,
        difficultyLevel: body.difficultyLevel,
        status: body.status,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
