import Link from "next/link";
import { getListingImage } from "@/lib/images";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    images?: string[];
    discountPrice?: number | null;
    pricePerPerson: number;
    avgRating?: number | null;
    shortDescription?: string | null;
    durationDays?: number | null;
    durationHours?: number | null;
    groupSizeMin: number;
    groupSizeMax: number;
    difficultyLevel?: string | null;
    destination?: { name: string; slug?: string } | null;
    category?: { slug?: string } | null;
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = getListingImage(
    listing.images,
    listing.category?.slug,
    listing.destination?.slug
  );

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-900 shadow-sm">
          ₹{listing.discountPrice || listing.pricePerPerson}
        </div>
      </div>
      <div className="flex flex-col flex-grow p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded text-sm font-medium text-gray-700 shrink-0">
            <span className="text-yellow-500">★</span>
            {listing.avgRating?.toFixed(1) || "New"}
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
          {listing.shortDescription}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">📍</span>
            <span className="truncate">{listing.destination?.name || "Maharashtra"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">⏱</span>
            <span>
              {listing.durationDays ? `${listing.durationDays} Days` : `${listing.durationHours} Hours`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">👥</span>
            <span>{listing.groupSizeMin}-{listing.groupSizeMax} pax</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-emerald-600">
            {listing.difficultyLevel || "Easy"}
          </div>
        </div>
      </div>
    </Link>
  );
}
