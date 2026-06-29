import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import ListingCard from "@/components/listings/ListingCard";
import MapEmbed from "@/components/shared/MapEmbed";
import WeatherWidget from "@/components/shared/WeatherWidget";
import BackButton from "@/components/shared/BackButton";
import { fetchWeather } from "@/lib/weather";
import { MapPin, Info, ExternalLink } from "lucide-react";
import Link from "next/link";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

const getCachedDestination = unstable_cache(
  (slug: string) =>
    prisma.destination.findUnique({
      where: { slug },
      include: {
        listings: {
          where: { status: "PUBLISHED" },
          include: { category: true, destination: true },
        },
      },
    }),
  ["destination-detail"],
  { revalidate: 120 }
);

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const dest = await getCachedDestination(params.slug);
  return {
    title: dest ? `${dest.name} | MahaAdventures` : "Destination Not Found",
    description: dest?.description,
  };
}

export default async function DestinationPage({ params }: { params: { slug: string } }) {
  const destination = await getCachedDestination(params.slug);

  if (!destination) {
    notFound();
  }

  const weather =
    destination.latitude && destination.longitude
      ? await fetchWeather(destination.latitude, destination.longitude)
      : null;

  const mapsKey = process.env.GOOGLE_MAPS_API_KEY;
  const directionsUrl =
    destination.latitude && destination.longitude
      ? mapsKey
        ? `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`
        : `https://www.openstreetmap.org/directions?to=${destination.latitude},${destination.longitude}`
      : null;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="relative h-[42vh] min-h-[320px] w-full bg-gray-900 overflow-hidden">
        <Image
          src={destination.heroImageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"}
          alt={destination.name}
          fill
          sizes="100vw"
          className="object-cover opacity-60 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

        {/* Back navigation */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <BackButton
            href="/destinations"
            label="All Destinations"
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:text-white px-4 py-2 rounded-full [&>span]:bg-white/20 [&>span]:border-white/30"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
              {destination.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/90 text-lg font-medium">
              <MapPin className="w-5 h-5" />
              {destination.district || destination.region}, Maharashtra
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {destination.name}</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{destination.description}</p>

            <div className="flex flex-wrap gap-4">
              {destination.bestSeason && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-lg text-sm font-medium">
                  <Info className="w-4 h-4" />
                  Best Season: {destination.bestSeason}
                </div>
              )}
              {destination.difficultyTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0">
            <WeatherWidget weather={weather} />

            <div className="bg-gray-100 h-48 rounded-xl border border-gray-200 overflow-hidden relative">
              {destination.latitude && destination.longitude ? (
                <MapEmbed
                  latitude={destination.latitude}
                  longitude={destination.longitude}
                  name={destination.name}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400 text-sm font-medium">
                  Map Data Unavailable
                </div>
              )}
            </div>

            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-lg transition-colors"
              >
                Get Directions <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Adventures in {destination.name}
            <span className="bg-gray-100 text-gray-600 text-sm px-2.5 py-0.5 rounded-full font-medium">
              {destination.listings.length}
            </span>
          </h2>

          {destination.listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500 mb-4">No active listings available right now.</p>
              <Link href="/explore" className="text-emerald-600 font-semibold hover:underline">
                Explore other destinations
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
