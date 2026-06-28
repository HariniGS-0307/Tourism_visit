"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDestinationImage } from "@/lib/images";
import { SkeletonGrid } from "@/components/shared/SkeletonLoader";

interface DestinationsGridProps {
  title?: string;
  subtitle?: string;
}

export default function DestinationsGrid({
  title = "Explore Maharashtra",
  subtitle = "Discover breathtaking landscapes, historic forts, and thrilling adventures across the state.",
}: DestinationsGridProps) {
  const [destinations, setDestinations] = useState<
    {
      id: string;
      slug: string;
      name: string;
      description: string | null;
      heroImageUrl: string | null;
      region: string | null;
      district: string | null;
      bestSeason: string | null;
      _count?: { listings: number };
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (region) params.append("region", region);

        const res = await fetch(`/api/destinations?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setDestinations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchDestinations, 300);
    return () => clearTimeout(timer);
  }, [search, region]);

  const regions = [
    "Western Ghats",
    "Konkan Coast",
    "Vidarbha",
    "Marathwada",
    "Pune",
    "Ahmednagar",
    "Satara",
    "Nashik",
    "Sindhudurg",
    "Raigad",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">{title}</h1>
        <p className="text-lg text-gray-600">{subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            🔍
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64 flex-shrink-0">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-white"
          >
            <option value="">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : destinations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 border-dashed">
          <span className="text-4xl block mb-3">📍</span>
          <h3 className="text-lg font-medium text-gray-900">No destinations found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or region filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-56 w-full overflow-hidden bg-emerald-100">
                <img
                  src={getDestinationImage(dest.slug, dest.heroImageUrl)}
                  alt={dest.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
                  📍 {dest.region || dest.district}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{dest.description}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-xs font-medium">
                    {dest._count?.listings || 0} Listings
                  </span>
                  {dest.bestSeason && (
                    <div className="text-xs text-gray-500 font-medium">
                      Best: <span className="text-gray-900">{dest.bestSeason}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
