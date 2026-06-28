import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

export default async function OperatorBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "OPERATOR") redirect("/unauthorized");

  const profile = await prisma.operatorProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) redirect("/unauthorized");

  const bookings = await prisma.booking.findMany({
    where: { listing: { operatorId: profile.id } },
    include: {
      listing: true,
      slot: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Incoming Bookings</h1>
          <p className="text-gray-500 mt-1">Manage bookings for your listings.</p>
        </div>
        <Link href="/dashboard/operator" className="text-sm text-emerald-600 font-medium hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <p className="text-gray-500">No bookings yet.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900">{booking.listing.title}</h3>
                <p className="text-sm text-gray-500">{booking.user.name} · {booking.user.email}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(booking.slot.date).toLocaleDateString("en-IN")}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {booking.numberOfPeople} pax</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  booking.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"
                }`}>{booking.status}</span>
                <div className="text-lg font-bold text-gray-900 mt-2">₹{booking.totalAmount}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
