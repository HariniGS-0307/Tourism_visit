import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, slotId, numberOfPeople, couponCode } = body;

    if (!listingId || !slotId || !numberOfPeople) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Wrap in a transaction to handle concurrency properly
    const booking = await prisma.$transaction(async (tx) => {
      // Ensure the session maps to a Prisma user. If the user exists by id use it,
      // otherwise try email lookup and create a new user record as a fallback.
      let prismaUserId: string | undefined = session.user.id as string | undefined;
      if (prismaUserId) {
        const existingById = await tx.user.findUnique({ where: { id: prismaUserId } });
        if (!existingById) prismaUserId = undefined;
      }

      if (!prismaUserId) {
        if (!session.user.email) {
          throw new Error("Unauthorized. Please log in.");
        }
        const existingByEmail = await tx.user.findUnique({ where: { email: session.user.email } });
        if (existingByEmail) {
          prismaUserId = existingByEmail.id;
        } else {
          const created = await tx.user.create({
            data: {
              name: session.user.name ?? session.user.email.split("@")[0],
              email: session.user.email,
              image: session.user.image ?? null,
              role: "USER",
            },
          });
          prismaUserId = created.id;
        }
      }
      const listing = await tx.listing.findUnique({
        where: { id: listingId }
      });

      if (!listing) {
        throw new Error("Listing not found");
      }

      if (numberOfPeople < listing.groupSizeMin || numberOfPeople > listing.groupSizeMax) {
        throw new Error(`Group size must be between ${listing.groupSizeMin} and ${listing.groupSizeMax}`);
      }

      const slot = await tx.availabilitySlot.findUnique({
        where: { id: slotId }
      });

      if (!slot) {
        throw new Error("Availability slot not found");
      }

      if (!slot.isActive || slot.date < new Date()) {
        throw new Error("Slot is no longer available");
      }

      const spotsLeft = slot.capacity - slot.bookedCount;
      if (spotsLeft < numberOfPeople) {
        throw new Error(`Only ${spotsLeft} spots left for this date`);
      }

      // Update slot capacity
      await tx.availabilitySlot.update({
        where: { id: slotId },
        data: { bookedCount: { increment: numberOfPeople } }
      });

      const price = listing.discountPrice || listing.pricePerPerson;
      let totalAmount = price * numberOfPeople;

      if (couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
        const now = new Date();
        if (
          coupon &&
          coupon.validFrom <= now &&
          coupon.validTo >= now &&
          coupon.usedCount < coupon.maxUses
        ) {
          totalAmount = Math.round(totalAmount * (1 - coupon.discountPercent / 100));
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
      
      const reference = `BKG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Create Booking
      const newBooking = await tx.booking.create({
        data: {
          userId: prismaUserId,
          listingId: listingId,
          slotId: slotId,
          numberOfPeople: numberOfPeople,
          totalAmount: totalAmount,
          bookingReference: reference,
          status: "PENDING",
        },
      });

      return newBooking;
    });

    return NextResponse.json({ booking });
  } catch (error: unknown) {
    console.error("Error creating booking:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
