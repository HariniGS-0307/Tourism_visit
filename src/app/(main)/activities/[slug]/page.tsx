import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import ListingCard from "@/components/listings/ListingCard";
import FilterSidebarWrapper from "@/components/shared/FilterSidebarWrapper";
import FloatingMountains from "@/components/shared/FloatingMountains";
import BackButton from "@/components/shared/BackButton";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { getCategoryImage } from "@/lib/images";

import { withTimeout } from "@/lib/db-timeout";

const getCachedCategory = unstable_cache(
  async (slug: string) => {
    try {
      return await withTimeout(prisma.category.findUnique({ where: { slug } }));
    } catch {
      return null;
    }
  },
  ["category-detail"],
  { revalidate: 300 }
);

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await getCachedCategory(params.slug);
  return {
    title: category ? `${category.name} Adventures | MahaAdventures` : "Activity Not Found",
    description: category?.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const category = await getCachedCategory(params.slug);

  if (!category) {
    notFound();
  }

  const { price, difficulty, destination: destSlug } = searchParams;

  const where: Record<string, unknown> = {
    categoryId: category.id,
    status: "PUBLISHED",
  };

  if (difficulty) {
    where.difficultyLevel = difficulty;
  }

  if (price) {
    if (price === "under-1000") where.pricePerPerson = { lt: 1000 };
    if (price === "1000-3000") where.pricePerPerson = { gte: 1000, lte: 3000 };
    if (price === "3000-5000") where.pricePerPerson = { gte: 3000, lte: 5000 };
    if (price === "over-5000") where.pricePerPerson = { gt: 5000 };
  }

  if (destSlug) {
    where.destination = { slug: destSlug };
  }

  let listingsResult: Awaited<ReturnType<typeof prisma.listing.findMany>> = [];
  let allDestinationsResult: { slug: string; name: string }[] = [];

  try {
    const [listings, allDestinations] = await Promise.all([
      withTimeout(prisma.listing.findMany({
        where,
        include: { destination: true, category: true },
        orderBy: { avgRating: "desc" },
      })),
      withTimeout(prisma.destination.findMany({ orderBy: { name: "asc" }, select: { slug: true, name: true } })),
    ]);

    listingsResult = listings;
    allDestinationsResult = allDestinations;
  } catch (e) {
    listingsResult = [];
    allDestinationsResult = [];
  }

  const heroImg = getCategoryImage(category.slug, category.icon);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 bg-gray-900 overflow-hidden">
        <Image
          src={heroImg}
          alt={category.name}
          fill
          sizes="100vw"
          className="object-cover opacity-50 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
        <FloatingMountains variant="dark" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Back + Breadcrumb */}
            <div className="flex items-center gap-4 mb-4">
              <BackButton
                href="/activities"
                label="Activities"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:text-white px-3 py-1.5 rounded-full text-xs [&>span]:bg-white/20 [&>span]:border-white/30 [&>span]:w-6 [&>span]:h-6"
              />
              <nav className="flex items-center gap-1.5 text-sm text-white/60">
                <span className="text-white/60">›</span>
                <span className="text-white font-medium">{category.name}</span>
              </nav>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">{category.name} Adventures</h1>
            <p className="text-gray-200">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <FilterSidebarWrapper destinations={allDestinationsResult} />
          </div>

          {/* Results Grid */}
          <div className="flex-grow">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                <span className="font-bold text-emerald-600">{listingsResult.length}</span>{" "}
                adventure{listingsResult.length !== 1 ? "s" : ""} found
              </h2>
            </div>

            {listingsResult.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {listingsResult.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
                <span className="text-4xl mb-3 block">🏔️</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No listings found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters to see more results.</p>
                <Link href={`/activities/${params.slug}`} className="mt-4 inline-block text-sm text-emerald-600 font-semibold hover:underline">
                  Clear all filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
