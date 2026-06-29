import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/listings/ListingCard";
import FilterSidebarWrapper from "@/components/shared/FilterSidebarWrapper";
import { CompareCheckbox, CompareFloatingBar } from "@/components/listings/CompareTool";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { q, price, difficulty, category, destination } = searchParams;

  const where: Record<string, unknown> = {
    status: "PUBLISHED",
  };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
      { destination: { name: { contains: q, mode: "insensitive" } } },
      { category: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (destination) {
    where.destination = { slug: destination };
  }

  if (difficulty) {
    where.difficultyLevel = difficulty;
  }

  if (price) {
    if (price === "under-1000") where.pricePerPerson = { lt: 1000 };
    if (price === "1000-3000") where.pricePerPerson = { gte: 1000, lte: 3000 };
    if (price === "3000-5000") where.pricePerPerson = { gte: 3000, lte: 5000 };
    if (price === "over-5000") where.pricePerPerson = { gt: 5000 };
  }

  const listings = await prisma.listing.findMany({
    where,
    include: {
      destination: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-12 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Search Results</h1>
          {q && <p className="text-gray-600">Showing results for &ldquo;{q}&rdquo;</p>}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 flex-shrink-0">
            <FilterSidebarWrapper />
          </div>

          <div className="flex-grow">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">{listings.length} adventures found</h2>
            </div>

            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="relative group">
                    <ListingCard listing={listing} />
                    <CompareCheckbox listingId={listing.id} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                <h3 className="text-lg font-medium text-gray-900 mb-1">No listings found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <CompareFloatingBar />
    </div>
  );
}
