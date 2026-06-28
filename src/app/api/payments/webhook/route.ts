import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendBookingConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      if (process.env.NODE_ENV === "production") {
        console.error("RAZORPAY_WEBHOOK_SECRET is not set — rejecting webhook in production");
        return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
      }
      console.warn("RAZORPAY_WEBHOOK_SECRET not set — skipping signature check (dev only)");
    } else {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    if (event.event === "payment.captured" || event.event === "order.paid") {
      // payment.captured contains payment payload, order.paid contains order payload
      const payload = event.payload.payment?.entity || event.payload.order?.entity;
      const orderId = payload.order_id || payload.id; // handle both event shapes
      const paymentId = event.payload.payment?.entity?.id;

      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId }
      });

      if (payment && payment.status !== "PAID") {
        const result = await prisma.$transaction(async (tx) => {
          // Update payment status
          await tx.payment.update({
            where: { id: payment.id },
            data: { 
              status: "PAID",
              razorpayPaymentId: paymentId
            }
          });

          // Update booking status
          const updatedBooking = await tx.booking.update({
            where: { id: payment.bookingId },
            data: { status: "CONFIRMED" },
            include: { user: true, listing: true }
          });

          return updatedBooking;
        });
        
        console.log(`Payment confirmed for order: ${orderId}`);

        // Send Email Confirmation asynchronously
        if (result.user.email) {
          sendBookingConfirmation(
            result.user.email,
            result.bookingReference,
            result.listing.title,
            result.totalAmount
          ).catch(e => console.error("Email send failed:", e));
        }
      }
    } else if (event.event === "payment.failed") {
      const orderId = event.payload.payment.entity.order_id;
      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId }
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED" }
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
