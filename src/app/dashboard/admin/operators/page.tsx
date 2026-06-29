import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function verifyOperator(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return;

  const operatorId = formData.get("operatorId") as string;
  const action = formData.get("action") as string;

  await prisma.operatorProfile.update({
    where: { id: operatorId },
    data: { isVerified: action === "approve" },
  });

  revalidatePath("/dashboard/admin/operators");
}

export default async function AdminOperatorsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/unauthorized");

  const operators = await prisma.operatorProfile.findMany({
    include: { user: true, _count: { select: { listings: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Manage Operators</h1>
          <p className="text-gray-500 mt-1">Verify and manage adventure operators on the platform.</p>
        </div>
        <Link href="/dashboard/admin" className="text-sm text-emerald-600 font-medium hover:underline">
          ← Back to Admin
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Business</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Listings</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {operators.map((op) => (
              <tr key={op.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-900">{op.businessName}</td>
                <td className="px-6 py-4 text-gray-600">{op.user.email}</td>
                <td className="px-6 py-4 text-gray-600">{op.phone || "—"}</td>
                <td className="px-6 py-4">{op._count.listings}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      op.isVerified ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {op.isVerified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {!op.isVerified && (
                    <form action={verifyOperator} className="inline">
                      <input type="hidden" name="operatorId" value={op.id} />
                      <input type="hidden" name="action" value="approve" />
                      <button type="submit" className="text-emerald-600 hover:text-emerald-800 font-medium text-sm">
                        Approve
                      </button>
                    </form>
                  )}
                  {op.isVerified && (
                    <form action={verifyOperator} className="inline">
                      <input type="hidden" name="operatorId" value={op.id} />
                      <input type="hidden" name="action" value="reject" />
                      <button type="submit" className="text-red-600 hover:text-red-800 font-medium text-sm">
                        Revoke
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
