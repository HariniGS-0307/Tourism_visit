import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPaymentOrderSchema } from "@/lib/validators";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId } = createPaymentOrderSchema.parse(body);

    // Fetch booking to verify amount and ownership
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: { select: { id: true, email: true } } },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    const isBookingOwner = booking.userId === session.user.id;
    const isBookingOwnerByEmail =
      !isBookingOwner &&
      session.user.email &&
      booking.user?.email === session.user.email;
    if (!isBookingOwner && !isBookingOwnerByEmail) {
      return NextResponse.json({ error: "Unauthorized access to booking" }, { status: 403 });
    }
    if (booking.status !== "PENDING") {
      return NextResponse.json({ error: "Booking is not in PENDING state" }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amountInPaise = Math.round(booking.totalAmount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: booking.id,
      notes: { bookingId: booking.id, userId: session.user.id },
    });

    // Upsert payment record
    await prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: { razorpayOrderId: order.id, amount: booking.totalAmount, status: "CREATED" },
      create: {
        bookingId: booking.id,
        razorpayOrderId: order.id,
        amount: booking.totalAmount,
        status: "CREATED",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || null,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }
    console.error("Error creating payment order:", error);
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}
