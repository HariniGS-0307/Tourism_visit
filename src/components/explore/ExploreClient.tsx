"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mountain, Waves, Trees, Compass, Camera, Utensils, Music, Map,
  ArrowRight, Star, Clock, ChevronDown, Play, Users,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Listing {
  id: string;
  title: string;
  images: string[];
  pricePerPerson: number;
  discountPrice: number | null;
  avgRating: number;
  durationDays: number | null;
  durationHours: number | null;
  destination: { name: string };
  category: { name: string };
}

interface Props {
  trendingListings: Listing[];
}

// ── Static content ─────────────────────────────────────────────────────────
const FLAVOURS = [
  {
    icon: Mountain,
    title: "The Sahyadri Soul",
    description:
      "The Western Ghats spine of Maharashtra — a 1,600 km arc of misty peaks, rock-cut forts, and thundering monsoon waterfalls. Harihar Fort, Harishchandragad, Kalsubai — every ridge has a story.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=85",
    color: "from-emerald-900",
    link: "/destinations?region=Western+Ghats",
    cta: "Trek the Ghats",
  },
  {
    icon: Waves,
    title: "Konkan's Blue Edge",
    description:
      "720 km of coastline dotted with sea forts, cashew orchards, and powdery sand. Scuba dive at Tarkarli, cruise to Sindhudurg Fort, or simply watch the sunset at Ganpatipule.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
    color: "from-blue-900",
    link: "/destinations?region=Konkan+Coast",
    cta: "Explore the Coast",
  },
  {
    icon: Trees,
    title: "Vidarbha's Wild Heart",
    description:
      "The land of tigers. Tadoba, Pench, Nagzira — Maharashtra's eastern forests shelter Bengal tigers, leopards, sloth bears, and more species per square kilometre than almost anywhere in India.",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=900&q=85",
    color: "from-amber-900",
    link: "/destinations?region=Vidarbha",
    cta: "Safari Awaits",
  },
  {
    icon: Map,
    title: "Marathwada's Ancient Stones",
    description:
      "Ajanta's 2,000-year-old murals, Ellora's rock-cut cathedrals, Lonar's meteor crater lake — this region carries millennia of civilisation in its basalt bedrock.",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=900&q=85",
    color: "from-orange-900",
    link: "/destinations?region=Marathwada",
    cta: "Discover Heritage",
  },
];

const SEASONS = [
  {
    name: "Monsoon",
    months: "Jun – Sep",
    emoji: "🌧️",
    desc: "Waterfalls in full roar, Sahyadri peaks draped in mist. Best for Western Ghats treks and scenic drives.",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    name: "Winter",
    months: "Oct – Feb",
    emoji: "🌤️",
    desc: "Crisp air, clear skies, Kaas Plateau wildflowers. Best season for forts, safaris, and beach holidays.",
    color: "bg-amber-50 border-amber-200 text-amber-800",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    name: "Summer",
    months: "Mar – May",
    emoji: "☀️",
    desc: "Tiger sightings peak at waterholes. Perfect for Vidarbha safaris — Tadoba & Pench are at their best.",
    color: "bg-orange-50 border-orange-200 text-orange-800",
    badge: "bg-orange-100 text-orange-700",
  },
];

const QUICK_PICKS = [
  { label: "Treks under ₹1500", href: "/search?price=under-1000&category=trekking", icon: Mountain, color: "bg-emerald-500" },
  { label: "Weekend Camping", href: "/search?category=camping&duration=2", icon: Trees, color: "bg-orange-500" },
  { label: "Beach Water Sports", href: "/search?category=water-sports", icon: Waves, color: "bg-blue-500" },
  { label: "Tiger Safaris", href: "/search?category=wildlife-safari", icon: Compass, color: "bg-amber-500" },
  { label: "Fort Treks", href: "/search?q=fort", icon: Map, color: "bg-purple-500" },
  { label: "Monsoon Specials", href: "/search?q=monsoon", icon: Camera, color: "bg-teal-500" },
];

const CULTURE_TILES = [
  { icon: Utensils, title: "Vada Pav to Fresh Seafood", desc: "From Mumbai street food to Malvani thalis — the cuisine changes every 100 km." },
  { icon: Music, title: "Tamasha & Lavani", desc: "Folk music, Warli art, and the Ganesh festival — culture is alive at every destination." },
  { icon: Camera, title: "Festival Calendar", desc: "Trek during Diwali, camp on Holi, witness the harvest during Pola." },
  { icon: Users, title: "Local Operators", desc: "Every adventure is run by a Maharashtra-based operator who knows the terrain intimately." },
];

// ── Component ───────────────────────────────────────────────────────────────
function ExploreClient({ trendingListings }: Props) {
  return (
    <div className="flex flex-col overflow-x-hidden">

      {/* ── CINEMATIC HERO ──────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=85"
            alt="Maharashtra mountains"
            fill
            sizes="100vw"
            className="object-cover animate-slow-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 border border-emerald-400/20 text-sm font-semibold tracking-wider mb-6">
            <Compass className="w-4 h-4" /> DISCOVER THE REAL MAHARASHTRA
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-tight mb-5 drop-shadow-2xl">
            33,000 km² of <br />
            <span className="text-emerald-400">Pure Adventure</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            From the tiger forests of Vidarbha to the surf of Sindhudurg — Maharashtra holds more wild variety than any single state in India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-8 rounded-full text-lg transition-all shadow-lg shadow-emerald-500/30 hover:scale-105"
            >
              <Mountain className="w-5 h-5" /> Browse Destinations
            </Link>
            <Link
              href="/activities"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-4 px-8 rounded-full text-lg border border-white/25 transition-all hover:scale-105"
            >
              <Play className="w-5 h-5" /> Browse Activities
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ── QUICK PICKS ─────────────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">Jump right in</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {QUICK_PICKS.map(({ label, href, icon: Icon, color }) => (
              <Link
                key={label}
                href={href}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-semibold text-sm transition-all hover:scale-105 hover:border-gray-300 shadow-sm"
              >
                <span className={`w-6 h-6 rounded-full ${color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </span>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 FLAVOURS ──────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-3">Four distinct worlds</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">The Flavours of Maharashtra</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
              This isn't one place — it's four completely different landscapes stitched together into one extraordinary state.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FLAVOURS.map((f, i) => (
              <Link
                key={f.title}
                href={f.link}
                className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                style={{ height: i === 0 || i === 3 ? "420px" : "320px" }}
              >
                <Image
                  src={f.image}
                  alt={f.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${f.color}/90 via-transparent to-transparent`} />
                <div className={`absolute inset-0 bg-gradient-to-t ${f.color}/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-2">{f.title}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed mb-4 max-w-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {f.description}
                  </p>
                  <span className="inline-flex items-center gap-2 bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                    {f.cta} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEASON GUIDE ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Plan smarter</p>
            <h2 className="text-4xl font-extrabold text-gray-900">When to Come</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Maharashtra's seasons transform the landscape dramatically. Here's how to time your trip.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEASONS.map((s) => (
              <div key={s.name} className={`rounded-2xl border-2 p-7 ${s.color} hover:shadow-lg transition-shadow`}>
                <div className="text-4xl mb-4">{s.emoji}</div>
                <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${s.badge}`}>{s.months}</div>
                <h3 className="text-xl font-extrabold mb-2">{s.name}</h3>
                <p className="text-sm leading-relaxed opacity-90">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING ADVENTURES ─────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-end justify-between mb-10">
            <div>
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Top-rated right now</p>
              <h2 className="text-4xl font-extrabold text-gray-900">Trending Adventures</h2>
            </div>
            <Link href="/search" className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-emerald-600 font-semibold hover:text-emerald-800 group">
              See all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {trendingListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 card-hover flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={listing.images?.[0] || "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=85"}
                      alt={listing.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {listing.category.name}
                    </div>
                    <div className="absolute top-3 right-3 bg-white text-gray-900 text-sm font-bold px-2.5 py-1 rounded-full shadow-sm">
                      ₹{listing.discountPrice || listing.pricePerPerson}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {listing.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm mt-auto pt-3 border-t border-gray-50">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Mountain className="w-3.5 h-3.5 text-gray-400" /> {listing.destination.name}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-gray-800">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {listing.avgRating > 0 ? listing.avgRating.toFixed(1) : "New"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {listing.durationDays ? `${listing.durationDays}D` : `${listing.durationHours}h`}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">No listings available yet.</div>
          )}
        </div>
      </section>

      {/* ── CULTURE STRIP ───────────────────────────────────────────── */}
      <section className="py-20 bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-2">Beyond the outdoors</p>
            <h2 className="text-4xl font-extrabold">Maharashtra's Soul</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CULTURE_TILES.map((tile) => (
              <div key={tile.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                  <tile.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="font-bold text-white mb-2">{tile.title}</h4>
                <p className="text-emerald-200 text-sm leading-relaxed">{tile.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Ready to experience it?
          </h2>
          <p className="text-lg text-gray-500 mb-8">Browse all 33 destinations or jump straight to your favourite activity.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/destinations" className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105 shadow-lg">
              <Map className="w-5 h-5" /> All Destinations
            </Link>
            <Link href="/activities" className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105">
              <Compass className="w-5 h-5" /> All Activities
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default memo(ExploreClient);
