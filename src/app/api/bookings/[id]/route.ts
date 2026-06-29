import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        listing: { include: { destination: true, category: true } },
        slot: true,
        payment: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Users can only view their own bookings; admins can view all
    if (booking.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { slot: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { action } = await request.json();

    if (action === "cancel") {
      if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
        return NextResponse.json({ error: "Booking cannot be cancelled in its current state" }, { status: 400 });
      }
      // Only allow cancellation if more than 48 hours away
      const slotDate = new Date(booking.slot.date);
      const hoursUntil = (slotDate.getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursUntil < 48) {
        return NextResponse.json({ error: "Bookings can only be cancelled more than 48 hours before the activity" }, { status: 400 });
      }

      const updatedBooking = await prisma.$transaction(async (tx) => {
        // Return the spots
        await tx.availabilitySlot.update({
          where: { id: booking.slotId },
          data: { bookedCount: { decrement: booking.numberOfPeople } },
        });
        return tx.booking.update({
          where: { id: params.id },
          data: { status: "CANCELLED" },
        });
      });

      return NextResponse.json({ booking: updatedBooking });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
