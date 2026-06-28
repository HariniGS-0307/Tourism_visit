"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

interface BookingFormProps {
  listing: {
    id: string;
    groupSizeMin: number;
    groupSizeMax: number;
    discountPrice: number | null;
    pricePerPerson: number;
    availabilitySlots: {
      id: string;
      date: string | Date;
      capacity: number;
      bookedCount: number;
    }[];
  };
  user: { id: string } | null | undefined;
}

export default function BookingForm({ listing, user }: BookingFormProps) {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [peopleCount, setPeopleCount] = useState<number>(listing.groupSizeMin);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const price = listing.discountPrice || listing.pricePerPerson;
  const total = price * peopleCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/booking/${listing.id}`)}`);
      return;
    }

    if (!selectedSlot) {
      setError("Please select a date/slot.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          slotId: selectedSlot,
          numberOfPeople: peopleCount,
          couponCode: couponCode || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      router.push(`/booking/checkout?bookingId=${data.booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete your booking</h2>

      {!user && (
        <div className="mb-6 bg-amber-50 text-amber-800 p-4 rounded-lg text-sm font-medium border border-amber-100 flex items-center justify-between gap-4">
          <span>Sign in to complete your booking</span>
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(`/booking/${listing.id}`)}`}
            className="flex items-center gap-1.5 bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-700 shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Select a Date</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {listing.availabilitySlots.map((slot) => {
              const spotsLeft = slot.capacity - slot.bookedCount;
              const isFull = spotsLeft <= 0;
              const isSelected = selectedSlot === slot.id;

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isFull}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all text-sm
                    ${isFull ? "bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed"
                    : isSelected ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-600 bg-white"}`}
                >
                  <span className={`font-bold ${isSelected ? "text-emerald-900" : "text-gray-900"}`}>
                    {new Date(slot.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </span>
                  <span
                    className={`text-xs mt-1 ${isFull ? "text-red-500 font-medium" : isSelected ? "text-emerald-700" : "text-gray-500"}`}
                  >
                    {isFull ? "Sold Out" : `${spotsLeft} spots left`}
                  </span>
                </button>
              );
            })}
            {listing.availabilitySlots.length === 0 && (
              <div className="col-span-3 p-4 bg-gray-50 text-center text-gray-500 rounded-lg text-sm border border-gray-100">
                No upcoming dates available.
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Number of People</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setPeopleCount(Math.max(listing.groupSizeMin, peopleCount - 1))}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              -
            </button>
            <span className="text-lg font-bold w-8 text-center">{peopleCount}</span>
            <button
              type="button"
              onClick={() => setPeopleCount(Math.min(listing.groupSizeMax, peopleCount + 1))}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Min: {listing.groupSizeMin} | Max: {listing.groupSizeMax}
          </p>
        </div>

        <div>
          <label htmlFor="coupon" className="block text-sm font-semibold text-gray-900 mb-2">
            Coupon Code (optional)
          </label>
          <input
            id="coupon"
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="e.g. MAHA10"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">₹{price} × {peopleCount} people</span>
          <span className="font-semibold text-gray-900">₹{total}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-extrabold text-gray-900 mt-4">
          <span>Total Amount</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !selectedSlot}
        className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : user ? "Proceed to Payment" : "Sign In to Book"}
      </button>
    </form>
  );
}
