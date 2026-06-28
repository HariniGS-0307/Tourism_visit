"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Script from "next/script";
import Link from "next/link";
import { Calendar, Users, ArrowLeft } from "lucide-react";

export default function CheckoutClient({ booking }: { booking: any }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      setError("Payment gateway is loading. Please try again in a moment.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      if (!data.keyId && !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        throw new Error("Razorpay public key is not configured");
      }

      setInfo("Payment request created successfully. Redirecting to Razorpay...");

      const options = {
        key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag",
        amount: data.amount,
        currency: data.currency,
        name: "Maharashtra Adventures",
        description: `Payment for ${booking.listing.title}`,
        order_id: data.orderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          setInfo("Verifying payment details...");

          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || verifyData.status !== "confirmed") {
              throw new Error(verifyData.error || "Payment verification failed");
            }

            setInfo("Payment completed successfully. Redirecting...");
            router.push(`/booking/confirmation/${booking.id}`);
          } catch (verificationError) {
            setError(
              verificationError instanceof Error
                ? verificationError.message
                : "Payment verification failed"
            );
          }
        },
        prefill: {
          name: session?.user?.name || "Guest User",
          email: session?.user?.email || "guest@example.com",
          contact: "9999999999",
        },
        theme: { color: "#059669" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: { error: { description: string } }) {
        setError(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setScriptLoaded(true)} />

      <div className="max-w-xl mx-auto px-4">
        <Link href={`/listings/${booking.listingId}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Listing
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Reserved!</h1>
            <p className="text-gray-600">
              Your spot is saved. Please complete the payment to secure your reservation.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">{booking.listing.title}</h3>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-600" /> Date</span>
                <span className="font-medium text-gray-900">{new Date(booking.slot.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-emerald-600" /> Guests</span>
                <span className="font-medium text-gray-900">{booking.numberOfPeople}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="text-lg font-bold text-emerald-600">₹{booking.totalAmount}</span>
              </div>
            </div>
          </div>

          {(error || info) && (
            <div className={`mb-6 p-4 rounded-lg text-sm font-medium border ${error ? "bg-red-50 text-red-700 border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}>
              {error || info}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading || !scriptLoaded}
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70"
          >
            {loading ? "Processing..." : "Pay Securely with Razorpay"}
          </button>
        </div>
      </div>
    </div>
  );
}
