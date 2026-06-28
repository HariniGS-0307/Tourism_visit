import { prisma } from "@/lib/prisma";
import { generateBookingRef } from "@/lib/utils";
import type { CreateBookingInput } from "@/lib/validators";

export async function createBooking(userId: string, data: CreateBookingInput) {
  const { listingId, slotId, numberOfPeople, couponCode } = data;

  return prisma.$transaction(async (tx) => {
    const listing = await tx.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new Error("Listing not found");

    if (
      numberOfPeople < listing.groupSizeMin ||
      numberOfPeople > listing.groupSizeMax
    ) {
      throw new Error(
        `Group size must be between ${listing.groupSizeMin} and ${listing.groupSizeMax}`
      );
    }

    const slot = await tx.availabilitySlot.findUnique({ where: { id: slotId } });
    if (!slot) throw new Error("Availability slot not found");
    if (!slot.isActive || slot.date < new Date()) {
      throw new Error("Slot is no longer available");
    }

    const spotsLeft = slot.capacity - slot.bookedCount;
    if (spotsLeft < numberOfPeople) {
      throw new Error(`Only ${spotsLeft} spots left for this date`);
    }

    await tx.availabilitySlot.update({
      where: { id: slotId },
      data: { bookedCount: { increment: numberOfPeople } },
    });

    const price = listing.discountPrice ?? listing.pricePerPerson;
    let totalAmount = price * numberOfPeople;

    if (couponCode) {
      const coupon = await tx.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
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

    return tx.booking.create({
      data: {
        userId,
        listingId,
        slotId,
        numberOfPeople,
        totalAmount,
        bookingReference: generateBookingRef(),
        status: "PENDING",
        specialRequests: data.specialRequests,
      },
    });
  });
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      listing: { include: { destination: true } },
      slot: true,
      payment: true,
      review: true,
    },
  });
}

export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      listing: { include: { destination: true } },
      slot: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function cancelBooking(bookingId: string) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { slot: true },
    });
    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
      throw new Error("Only PENDING or CONFIRMED bookings can be cancelled");
    }

    // 48-hour cancellation policy
    const slotDate = new Date(booking.slot.date);
    const hoursUntilSlot = (slotDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilSlot < 48) {
      throw new Error("Bookings cannot be cancelled within 48 hours of the scheduled date");
    }

    await tx.availabilitySlot.update({
      where: { id: booking.slotId },
      data: { bookedCount: { decrement: booking.numberOfPeople } },
    });

    return tx.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
  });
}
