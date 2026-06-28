import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import ListingForm from "@/components/dashboard/ListingForm";

export default async function NewListingPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "OPERATOR") redirect("/unauthorized");

  const profile = await prisma.operatorProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) redirect("/unauthorized");

  const [categories, destinations] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.destination.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/dashboard/operator" className="text-sm text-emerald-600 font-medium hover:underline">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-4">Create New Listing</h1>
        <p className="text-gray-500 mt-1">Add a new adventure experience to your catalog.</p>
      </div>
      <ListingForm categories={categories} destinations={destinations} operatorId={profile.id} />
    </div>
  );
}
