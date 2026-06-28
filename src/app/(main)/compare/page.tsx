import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getListingImage } from "@/lib/images";

export default async function ComparePage({ 
  searchParams 
}: { 
  searchParams: { ids?: string } 
}) {
  const ids = searchParams.ids ? searchParams.ids.split(",") : [];

  if (ids.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Link href="/search" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-600 mb-8 transition-colors">
          ← Back to Search
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare Adventures</h1>
        <p className="text-gray-500 mb-8">Select up to 3 adventures to compare them side-by-side.</p>
        <Link href="/explore" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
          Browse Adventures
        </Link>
      </div>
    );
  }

  const listings = await prisma.listing.findMany({
    where: { id: { in: ids.slice(0, 3) } },
    include: { destination: true, category: true, operator: true }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link href="/search" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors">
          ← Back to Search
        </Link>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Compare Adventures</h1>
        <p className="text-gray-600">Side-by-side comparison of up to 3 adventures</p>
      </div>

      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="w-1/4 p-4 text-left font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-tl-xl">Features</th>
              {listings.map((listing) => (
                <th key={listing.id} className="w-1/4 p-4 bg-white border border-gray-200 align-top">
                   <img src={getListingImage(listing.images, listing.category.slug, listing.destination.slug)} alt={listing.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                   <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">{listing.title}</h3>
                   <div className="text-sm font-medium text-emerald-600 mt-1">₹{listing.discountPrice || listing.pricePerPerson}</div>
                </th>
              ))}
              {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => (
                 <th key={i} className="w-1/4 p-4 bg-gray-50 border border-gray-200 border-dashed align-middle text-center">
                   <div className="text-gray-400 text-sm font-medium">Empty Slot</div>
                 </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white text-sm">
            <tr>
              <td className="p-4 border border-gray-200 font-semibold text-gray-700 bg-gray-50">Destination</td>
              {listings.map(l => <td key={l.id} className="p-4 border border-gray-200">{l.destination.name}</td>)}
              {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => <td key={i} className="p-4 border border-gray-200 bg-gray-50/50"></td>)}
            </tr>
            <tr>
              <td className="p-4 border border-gray-200 font-semibold text-gray-700 bg-gray-50">Duration</td>
              {listings.map(l => <td key={l.id} className="p-4 border border-gray-200">{l.durationDays ? `${l.durationDays} Days` : `${l.durationHours} Hours`}</td>)}
              {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => <td key={i} className="p-4 border border-gray-200 bg-gray-50/50"></td>)}
            </tr>
            <tr>
              <td className="p-4 border border-gray-200 font-semibold text-gray-700 bg-gray-50">Difficulty</td>
              {listings.map(l => <td key={l.id} className="p-4 border border-gray-200 font-medium text-gray-900">{l.difficultyLevel}</td>)}
              {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => <td key={i} className="p-4 border border-gray-200 bg-gray-50/50"></td>)}
            </tr>
            <tr>
              <td className="p-4 border border-gray-200 font-semibold text-gray-700 bg-gray-50">Rating</td>
              {listings.map(l => <td key={l.id} className="p-4 border border-gray-200">{l.avgRating.toFixed(1)} / 5.0</td>)}
              {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => <td key={i} className="p-4 border border-gray-200 bg-gray-50/50"></td>)}
            </tr>
            <tr>
              <td className="p-4 border border-gray-200 font-semibold text-gray-700 bg-gray-50">Operator</td>
              {listings.map(l => <td key={l.id} className="p-4 border border-gray-200">{l.operator.businessName}</td>)}
              {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => <td key={i} className="p-4 border border-gray-200 bg-gray-50/50"></td>)}
            </tr>
            <tr>
               <td className="p-4 border border-gray-200 font-semibold text-gray-700 bg-gray-50"></td>
               {listings.map(l => (
                 <td key={l.id} className="p-4 border border-gray-200 text-center">
                   <Link href={`/listings/${l.id}`} className="inline-block w-full bg-emerald-600 text-white font-medium py-2 px-4 rounded hover:bg-emerald-700 transition-colors">
                     View Details
                   </Link>
                 </td>
               ))}
               {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => <td key={i} className="p-4 border border-gray-200 bg-gray-50/50"></td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
