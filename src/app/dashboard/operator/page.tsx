import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart3, Package, Calendar, Star } from "lucide-react";

export default async function OperatorDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "OPERATOR") {
    redirect("/unauthorized");
  }

  const profile = await prisma.operatorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      listings: {
        include: { _count: { select: { bookings: true } } }
      }
    }
  });

  if (!profile) {
    return <div className="p-8">Operator profile not found.</div>;
  }

  const totalListings = profile.listings.length;
  const activeListings = profile.listings.filter(l => l.status === "PUBLISHED").length;
  const totalBookings = profile.listings.reduce((sum, l) => sum + l._count.bookings, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Operator Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {profile.businessName}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/operator/listings/new" className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700">
            + New Listing
          </Link>
          <Link href="/dashboard/operator/bookings" className="bg-white text-emerald-700 border border-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50">
            Bookings
          </Link>
          <Link href="/dashboard/operator/analytics" className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50">
            Analytics
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
             <Package className="w-6 h-6" />
           </div>
           <div>
             <div className="text-sm font-medium text-gray-500">Total Listings</div>
             <div className="text-2xl font-bold text-gray-900">{totalListings}</div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
             <BarChart3 className="w-6 h-6" />
           </div>
           <div>
             <div className="text-sm font-medium text-gray-500">Active Listings</div>
             <div className="text-2xl font-bold text-gray-900">{activeListings}</div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
             <Calendar className="w-6 h-6" />
           </div>
           <div>
             <div className="text-sm font-medium text-gray-500">Total Bookings</div>
             <div className="text-2xl font-bold text-gray-900">{totalBookings}</div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center shrink-0">
             <Star className="w-6 h-6" />
           </div>
           <div>
             <div className="text-sm font-medium text-gray-500">Avg Rating</div>
             <div className="text-2xl font-bold text-gray-900">{profile.rating.toFixed(1)}</div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Your Listings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Bookings</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profile.listings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No listings found. Create your first one!</td>
                </tr>
              ) : (
                profile.listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{listing.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        listing.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
                        listing.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">₹{listing.discountPrice || listing.pricePerPerson}</td>
                    <td className="px-6 py-4">{listing._count.bookings}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/operator/listings/${listing.id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium mr-4">Edit</Link>
                      <Link href={`/listings/${listing.id}`} className="text-emerald-600 hover:text-emerald-800 font-medium">View</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
