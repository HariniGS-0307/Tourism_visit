import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function updateListingStatus(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return;

  const listingId = formData.get("listingId") as string;
  const status = formData.get("status") as "PUBLISHED" | "ARCHIVED";

  await prisma.listing.update({
    where: { id: listingId },
    data: { status },
  });

  revalidatePath("/dashboard/admin/listings");
}

export default async function AdminListingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/unauthorized");

  const listings = await prisma.listing.findMany({
    include: {
      operator: true,
      destination: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Moderate Listings</h1>
          <p className="text-gray-500 mt-1">Review and manage all platform listings.</p>
        </div>
        <Link href="/dashboard/admin" className="text-sm text-emerald-600 font-medium hover:underline">
          ← Back to Admin
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Operator</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{listing.title}</td>
                <td className="px-6 py-4 text-gray-600">{listing.operator.businessName}</td>
                <td className="px-6 py-4 text-gray-600">{listing.category.name}</td>
                <td className="px-6 py-4">₹{listing.discountPrice || listing.pricePerPerson}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      listing.status === "PUBLISHED"
                        ? "bg-emerald-100 text-emerald-800"
                        : listing.status === "DRAFT"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {listing.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link href={`/listings/${listing.id}`} className="text-emerald-600 hover:text-emerald-800 font-medium text-sm">
                    View
                  </Link>
                  {listing.status !== "PUBLISHED" && (
                    <form action={updateListingStatus} className="inline">
                      <input type="hidden" name="listingId" value={listing.id} />
                      <input type="hidden" name="status" value="PUBLISHED" />
                      <button type="submit" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        Publish
                      </button>
                    </form>
                  )}
                  {listing.status === "PUBLISHED" && (
                    <form action={updateListingStatus} className="inline">
                      <input type="hidden" name="listingId" value={listing.id} />
                      <input type="hidden" name="status" value="ARCHIVED" />
                      <button type="submit" className="text-red-600 hover:text-red-800 font-medium text-sm">
                        Unpublish
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
