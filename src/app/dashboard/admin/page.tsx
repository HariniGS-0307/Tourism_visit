import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Building2, Map, CreditCard, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const [
    usersCount, 
    operatorsCount, 
    listingsCount, 
    bookingsCount,
    unverifiedOperators
  ] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.operatorProfile.count(),
    prisma.listing.count(),
    prisma.booking.count(),
    prisma.operatorProfile.findMany({
      where: { isVerified: false },
      include: { user: true },
      take: 5
    })
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and moderation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
             <Users className="w-6 h-6" />
           </div>
           <div>
             <div className="text-sm font-medium text-gray-500">Total Users</div>
             <div className="text-2xl font-bold text-gray-900">{usersCount}</div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
             <Building2 className="w-6 h-6" />
           </div>
           <div>
             <div className="text-sm font-medium text-gray-500">Total Operators</div>
             <div className="text-2xl font-bold text-gray-900">{operatorsCount}</div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
             <Map className="w-6 h-6" />
           </div>
           <div>
             <div className="text-sm font-medium text-gray-500">Total Listings</div>
             <div className="text-2xl font-bold text-gray-900">{listingsCount}</div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
             <CreditCard className="w-6 h-6" />
           </div>
           <div>
             <div className="text-sm font-medium text-gray-500">Total Bookings</div>
             <div className="text-2xl font-bold text-gray-900">{bookingsCount}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Verification Queue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-500" />
              Operator Verification Queue
            </h2>
            <Link href="/dashboard/admin/operators" className="text-sm text-blue-600 font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="p-0">
            {unverifiedOperators.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No pending operators to verify.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {unverifiedOperators.map(op => (
                  <li key={op.id} className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">{op.businessName}</h4>
                      <p className="text-sm text-gray-500">{op.user.email} • {op.phone}</p>
                    </div>
                    <Link href={`/dashboard/admin/operators`} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-200">
                      Review Docs
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Management Links</h2>
          <div className="space-y-4">
            <Link href="/dashboard/admin/bookings" className="block p-4 rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all">
              <h3 className="font-bold text-gray-900">All Bookings</h3>
              <p className="text-sm text-gray-500 mt-1">View platform-wide bookings and export data.</p>
            </Link>
            <Link href="/dashboard/admin/users" className="block p-4 rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all">
              <h3 className="font-bold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-500 mt-1">Suspend accounts, reset passwords, view user details.</p>
            </Link>
            <Link href="/dashboard/admin/operators" className="block p-4 rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all">
              <h3 className="font-bold text-gray-900">Manage Operators</h3>
              <p className="text-sm text-gray-500 mt-1">Verify new operators, review complaints, manage tiers.</p>
            </Link>
            <Link href="/dashboard/admin/listings" className="block p-4 rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all">
              <h3 className="font-bold text-gray-900">Moderate Listings</h3>
              <p className="text-sm text-gray-500 mt-1">Review newly published listings, unpublish inappropriate content.</p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
