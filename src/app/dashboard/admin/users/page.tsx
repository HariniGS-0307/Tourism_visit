import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/unauthorized");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: true } } },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Manage Users</h1>
          <p className="text-gray-500 mt-1">View all registered users on the platform.</p>
        </div>
        <Link href="/dashboard/admin" className="text-sm text-emerald-600 font-medium hover:underline">
          ← Back to Admin
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Bookings</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.name || "—"}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">{user._count.bookings}</td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
