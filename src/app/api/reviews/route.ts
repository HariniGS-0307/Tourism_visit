import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId, bookingId, rating, comment } = await request.json();

    if (!listingId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid input: listingId and rating (1-5) are required" }, { status: 400 });
    }

    let finalUserId = session.user.id;

    // Verify the booking belongs to this user and is COMPLETED
    if (bookingId) {
      const booking = await prisma.booking.findUnique({ 
        where: { id: bookingId },
        include: { user: true } 
      });
      
      const isOwner = booking?.userId === session.user.id;
      const isOwnerByEmail = !isOwner && session.user.email && booking?.user?.email === session.user.email;
      
      if (!booking || (!isOwner && !isOwnerByEmail)) {
        return NextResponse.json({ error: "Booking not found or does not belong to you" }, { status: 403 });
      }
      if (booking.status !== "COMPLETED") {
        return NextResponse.json({ error: "You can only review completed bookings" }, { status: 400 });
      }
      // Prevent duplicate review for the same booking
      const existing = await prisma.review.findUnique({ where: { bookingId } });
      if (existing) {
        return NextResponse.json({ error: "You have already reviewed this booking" }, { status: 400 });
      }
      finalUserId = booking.userId; // Use the correct DB userId from the booking
    }

    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          userId: finalUserId,
          listingId,
          bookingId: bookingId || undefined,
          rating,
          comment: comment || undefined,
        },
      });

      // Recalculate listing avg rating
      const agg = await tx.review.aggregate({
        where: { listingId },
        _avg: { rating: true },
      });
      await tx.listing.update({
        where: { id: listingId },
        data: { avgRating: agg._avg.rating ?? 0 },
      });

      return newReview;
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");
    if (!listingId) {
      return NextResponse.json({ error: "listingId is required" }, { status: 400 });
    }
    const reviews = await prisma.review.findMany({
      where: { listingId },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
