import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/unauthorized");

  const bookings = await prisma.booking.findMany({
    include: {
      user: { select: { name: true, email: true } },
      listing: { select: { title: true } },
      slot: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">All Bookings</h1>
          <p className="text-gray-500 mt-1">Platform-wide booking overview.</p>
        </div>
        <Link href="/dashboard/admin" className="text-sm text-emerald-600 font-medium hover:underline">
          ← Back to Admin
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Listing</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-mono text-xs">{b.bookingReference}</td>
                <td className="px-6 py-4">{b.user.name || b.user.email}</td>
                <td className="px-6 py-4">{b.listing.title}</td>
                <td className="px-6 py-4">{new Date(b.slot.date).toLocaleDateString("en-IN")}</td>
                <td className="px-6 py-4">₹{b.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    b.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"
                  }`}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
