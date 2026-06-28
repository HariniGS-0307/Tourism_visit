import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { sendBookingConfirmation } from "@/lib/email";

const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, "Razorpay order ID is required"),
  paymentId: z.string().min(1, "Razorpay payment ID is required"),
  razorpaySignature: z.string().min(1, "Razorpay signature is required"),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, paymentId, razorpaySignature } = verifyPaymentSchema.parse(body);

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: {
        booking: {
          include: { user: true, listing: true },
        },
      },
    });

    if (!payment || !payment.booking) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    const isBookingOwner = payment.booking.userId === session.user.id;
    const isBookingOwnerByEmail =
      !isBookingOwner &&
      session.user.email &&
      payment.booking.user?.email === session.user.email;

    if (!isBookingOwner && !isBookingOwnerByEmail) {
      return NextResponse.json({ error: "Unauthorized access to payment" }, { status: 403 });
    }

    if (payment.status === "PAID") {
      return NextResponse.json({ status: "already_paid" });
    }

    const updatedBooking = await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          razorpayPaymentId: paymentId,
        },
      });

      return tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CONFIRMED" },
        include: { user: true, listing: true },
      });
    });

    if (updatedBooking.user.email) {
      sendBookingConfirmation(
        updatedBooking.user.email,
        updatedBooking.bookingReference,
        updatedBooking.listing.title,
        updatedBooking.totalAmount
      ).catch((error) => console.error("Email send failed:", error));
    }

    return NextResponse.json({ status: "confirmed" });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }

    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
