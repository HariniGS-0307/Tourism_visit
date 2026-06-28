import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OperatorAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "OPERATOR") redirect("/unauthorized");

  const profile = await prisma.operatorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      listings: {
        include: { _count: { select: { bookings: true } } },
        orderBy: { avgRating: "desc" },
        take: 5,
      },
    },
  });

  if (!profile) redirect("/unauthorized");

  const totalBookings = profile.listings.reduce((sum, l) => sum + l._count.bookings, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Performance overview for {profile.businessName}</p>
        </div>
        <Link href="/dashboard/operator" className="text-sm text-emerald-600 font-medium hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500">Total Listings</div>
          <div className="text-3xl font-bold text-gray-900">{profile.listings.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500">Total Bookings</div>
          <div className="text-3xl font-bold text-gray-900">{totalBookings}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500">Average Rating</div>
          <div className="text-3xl font-bold text-gray-900">{profile.rating.toFixed(1)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Top Performing Listings</h2>
        {profile.listings.length === 0 ? (
          <p className="text-gray-500 text-sm">No listings yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {profile.listings.map((listing) => (
              <li key={listing.id} className="py-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{listing.title}</div>
                  <div className="text-sm text-gray-500">{listing._count.bookings} bookings · ★ {listing.avgRating.toFixed(1)}</div>
                </div>
                <Link href={`/listings/${listing.id}`} className="text-sm text-emerald-600 font-medium hover:underline">
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
