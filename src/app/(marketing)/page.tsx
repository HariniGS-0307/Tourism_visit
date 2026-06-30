import Link from "next/link";
import Image from "next/image";
import { MapPin, Compass, Star, Shield, Zap, TrendingUp, ArrowRight, Mountain, Waves, Trees } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import ScrollReveal from "@/components/shared/ScrollReveal";
import HeroParallax from "@/components/shared/HeroParallax";
import FloatingMountains from "@/components/shared/FloatingMountains";
import { withTimeout } from "@/lib/db-timeout";

export const dynamic = "force-dynamic";

const getStats = unstable_cache(
  async () => {
    try {
      const [destinations, listings, categories] = await Promise.all([
        withTimeout(prisma.destination.count()),
        withTimeout(prisma.listing.count({ where: { status: "PUBLISHED" } })),
        withTimeout(prisma.category.count()),
      ]);
      return { destinations, listings, categories };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return { destinations: 0, listings: 0, categories: 0 };
    }
  },
  ["landing-stats"],
  { revalidate: 300 } // 5 min
);

const getFeaturedDestinations = unstable_cache(
  async () => {
    try {
      return await withTimeout(prisma.destination.findMany({
        include: { _count: { select: { listings: { where: { status: "PUBLISHED" } } } } },
        orderBy: { name: "asc" },
        take: 6,
      }));
    } catch (error) {
      console.error("Error fetching destinations:", error);
      return [];
    }
  },
  ["landing-destinations"],
  { revalidate: 300 }
);

const getFeaturedListings = unstable_cache(
  async () => {
    try {
      return await withTimeout(prisma.listing.findMany({
        where: { status: "PUBLISHED" },
        include: { destination: true, category: true },
        orderBy: { avgRating: "desc" },
        take: 3,
      }));
    } catch (error) {
      console.error("Error fetching listings:", error);
      return [];
    }
  },
  ["landing-listings"],
  { revalidate: 300 }
);

const getCategories = unstable_cache(
  async () => {
    try {
      return await withTimeout(prisma.category.findMany({
        include: { _count: { select: { listings: { where: { status: "PUBLISHED" } } } } },
        take: 6,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
  ["landing-categories"],
  { revalidate: 300 }
);

export default async function LandingPage() {
  const [stats, destinations, listings, categories] = await Promise.all([
    getStats(),
    getFeaturedDestinations(),
    getFeaturedListings(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ── HERO — 3D Mountain Scene ─────────────────────────────────── */}
      <HeroParallax>
      <section className="relative h-[100vh] min-h-[680px] flex items-center justify-center bg-[#0a1a12] overflow-hidden">

        {/* === Layer 1: Background photo (slowest) === */}
        <div className="absolute inset-0 parallax-slow">
          <Image
            src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=2000&q=80"
            alt="Sahyadri Mountains"
            fill priority
            className="object-cover opacity-40 animate-mountain"
            sizes="100vw"
          />
        </div>

        {/* === Layer 2: Gradient overlay === */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a12]/60 via-transparent to-[#0a1a12]/95" />

        {/* === Layer 3: SVG mountain silhouette (3D depth) === */}
        <div className="absolute bottom-0 left-0 right-0 parallax-med pointer-events-none select-none">
          <svg viewBox="0 0 1440 320" className="w-full" preserveAspectRatio="none" style={{ marginBottom: "-2px" }}>
            {/* Far mountains — darkest */}
            <path d="M0,320 L120,180 L260,230 L400,140 L560,190 L720,100 L880,160 L1040,120 L1200,170 L1320,110 L1440,150 L1440,320 Z"
              fill="rgba(5,150,105,0.08)" />
            {/* Mid mountains */}
            <path d="M0,320 L80,220 L200,260 L360,160 L500,210 L660,130 L820,180 L980,150 L1140,200 L1300,140 L1440,180 L1440,320 Z"
              fill="rgba(5,150,105,0.12)" />
            {/* Near mountains — lightest green tint */}
            <path d="M0,320 L160,240 L320,280 L480,200 L640,250 L800,180 L960,230 L1120,190 L1280,240 L1440,200 L1440,320 Z"
              fill="rgba(16,185,129,0.15)" />
            {/* Foreground ridge */}
            <path d="M0,320 L0,300 L200,270 L400,290 L600,260 L800,280 L1000,255 L1200,275 L1440,260 L1440,320 Z"
              fill="rgba(6,78,59,0.5)" />
          </svg>
        </div>

        {/* === Layer 4: Floating particles === */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { l:"15%", b:"30%", s:4, c:"#10b981", d:0 },
            { l:"30%", b:"50%", s:3, c:"#34d399", d:0.8 },
            { l:"55%", b:"35%", s:5, c:"#6ee7b7", d:1.6 },
            { l:"70%", b:"60%", s:3, c:"#10b981", d:2.4 },
            { l:"85%", b:"40%", s:4, c:"#34d399", d:3.0 },
            { l:"45%", b:"25%", s:2, c:"#a7f3d0", d:0.5 },
            { l:"22%", b:"70%", s:3, c:"#6ee7b7", d:1.2 },
            { l:"78%", b:"55%", s:2, c:"#10b981", d:2.8 },
          ].map((p, i) => (
            <div
              key={i}
              className="particle absolute rounded-full"
              style={{
                left: p.l,
                bottom: p.b,
                width: p.s,
                height: p.s,
                background: p.c,
                boxShadow: `0 0 ${p.s * 2}px ${p.c}`,
                animationDuration: `${3.5 + i * 0.3}s`,
                animation: `particleRise ${3.5 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${p.d}s`,
              }}
            />
          ))}
        </div>

        {/* === Layer 5: Decorative glowing orbs === */}
        <div className="absolute top-1/4 left-1/6 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute top-1/3 right-1/6 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-emerald-300/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />

        {/* === Hero content === */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full glass border-neon text-emerald-300 text-sm font-bold tracking-widest mb-8 animate-fade-in-up">
            <Mountain className="w-4 h-4" />
            MAHARASHTRA&apos;S #1 ADVENTURE PLATFORM
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-[1.0] mb-6 animate-fade-in-up delay-100">
            Your Next{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg,#10b981,#34d399,#6ee7b7,#10b981)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradientShift 4s ease infinite",
              }}
            >
              Adventure
            </span>
            <br />
            <span className="text-white">Starts Here</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Discover, compare, and book verified treks, camping, and water sports across Maharashtra — with top-rated local operators.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up delay-300">
            <Link
              href="/explore"
              className="btn-shine inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 glow-emerald-sm"
            >
              <Compass className="w-5 h-5" /> Explore Adventures
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 glass hover:bg-white/15 text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105"
            >
              Browse Activities <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12 animate-fade-in-up delay-400">
            {[
              { value: `${stats.destinations}+`, label: "Destinations" },
              { value: `${stats.listings}+`, label: "Adventures" },
              { value: "500+", label: "Bookings" },
              { value: "4.8★", label: "Avg Rating" },
            ].map((s) => (
              <div key={s.label} className="text-center group">
                <div className="text-3xl sm:text-4xl font-black stat-number group-hover:animate-number-glow transition-all">{s.value}</div>
                <div className="text-gray-400 text-xs font-semibold tracking-wider uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce">
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-emerald-400/50 to-transparent" />
        </div>
      </section>
      </HeroParallax>

      {/* ── ACTIVITY TICKER STRIP ────────────────────────────────────── */}
      <div className="bg-emerald-600 py-3 overflow-hidden">
        <div className="animate-ticker flex gap-12 whitespace-nowrap">
          {[
            "🥾 Trekking","🏕️ Camping","🐯 Wildlife Safari","🌊 Water Sports",
            "🧗 Rock Climbing","🚵 Cycling","🪂 Paragliding","🏄 Surfing",
            "🥾 Trekking","🏕️ Camping","🐯 Wildlife Safari","🌊 Water Sports",
            "🧗 Rock Climbing","🚵 Cycling","🪂 Paragliding","🏄 Surfing",
          ].map((item, i) => (
            <span key={i} className="text-white font-semibold text-sm tracking-wide px-4">{item}</span>
          ))}
        </div>
      </div>

      {/* ── BROWSE BY ACTIVITY ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col sm:flex-row justify-between items-end mb-12">
            <div>
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">What you love to do</p>
              <h2 className="text-4xl font-extrabold text-gray-900">Browse by Activity</h2>
            </div>
            <Link href="/activities" className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-emerald-600 font-semibold hover:text-emerald-800 transition-colors group">
              View all activities <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/activities/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover"
                style={{ height: i === 0 || i === 3 ? "280px" : "220px" }}
              >
                <Image
                  src={cat.icon || "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                  <span className="text-emerald-300 text-sm font-medium">{cat._count.listings} adventures</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DESTINATIONS ────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12">
            <div>
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Maharashtra's best</p>
              <h2 className="text-4xl font-extrabold text-gray-900">Top Destinations</h2>
            </div>
            <Link href="/destinations" className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-emerald-600 font-semibold hover:text-emerald-800 transition-colors group">
              All destinations <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover"
              >
                {/* Uniform 16:9 aspect ratio */}
                <div className="relative w-full" style={{ paddingBottom: "62.5%" }}>
                  <Image
                    src={dest.heroImageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/85 via-gray-900/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {dest.region || dest.district}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="font-medium text-emerald-300">{dest._count.listings} adventures</span>
                      {dest.bestSeason && (
                        <span className="text-gray-400">· {dest.bestSeason}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP LISTINGS ─────────────────────────────────────────────── */}
      {listings.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-12">
              <div>
                <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Highest rated</p>
                <h2 className="text-4xl font-extrabold text-gray-900">Trending Adventures</h2>
              </div>
              <Link href="/search" className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-emerald-600 font-semibold hover:text-emerald-800 transition-colors group">
                See all listings <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 card-hover flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={listing.images?.[0] || "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"}
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {listing.category.name}
                    </div>
                    <div className="absolute top-3 right-3 bg-white text-gray-900 text-sm font-bold px-2.5 py-1 rounded-full shadow-sm">
                      ₹{listing.discountPrice || listing.pricePerPerson}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">{listing.shortDescription}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {listing.destination.name}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-gray-900">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {listing.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
      <section className="py-24 bg-emerald-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-700/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <FloatingMountains variant="emerald" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-4">Why choose us</p>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Your gateway to the <span className="text-emerald-400">Sahyadris</span>
              </h2>
              <p className="text-emerald-200 text-lg mb-10 leading-relaxed">
                We partner exclusively with background-verified, safety-certified operators to bring you authentic adventure experiences across Maharashtra.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {[
                  { icon: Shield, title: "Verified Operators", desc: "Every operator is vetted for safety and quality before listing." },
                  { icon: Zap, title: "Instant Booking", desc: "No waiting. Secure your spot in minutes, not days." },
                  { icon: TrendingUp, title: "Best Price", desc: "Competitive prices guaranteed — no hidden fees." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-white mb-1">{title}</h4>
                    <p className="text-emerald-200 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 px-7 rounded-full transition-all hover:scale-105 shadow-lg shadow-emerald-500/25"
              >
                Start Exploring <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="relative hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=700&q=80"
                alt="Trekking in Maharashtra"
                width={700}
                height={500}
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
              {/* Floating badges */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-2xl text-gray-900 max-w-[220px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(n => (
                      <Image key={n} className="w-9 h-9 rounded-full border-2 border-white object-cover" src={`https://i.pravatar.cc/100?img=${n + 10}`} alt="" width={36} height={36} />
                    ))}
                  </div>
                  <div className="text-sm font-bold">10k+ Explorers</div>
                </div>
                <p className="text-xs text-gray-500 font-medium">Booked their adventure this month</p>
              </div>
              <div className="absolute top-6 -right-6 bg-emerald-500 p-4 rounded-2xl shadow-xl text-white">
                <div className="text-2xl font-black">4.8★</div>
                <div className="text-emerald-100 text-xs font-medium">Avg rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ADVENTURE TYPES STRIP ────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Mountain, label: "Trekking", href: "/activities/trekking", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
              { icon: Trees, label: "Camping", href: "/activities/camping", color: "bg-orange-50 text-orange-700 border-orange-200" },
              { icon: Waves, label: "Water Sports", href: "/activities/water-sports", color: "bg-blue-50 text-blue-700 border-blue-200" },
              { icon: Compass, label: "Wildlife Safari", href: "/activities/wildlife-safari", color: "bg-amber-50 text-amber-700 border-amber-200" },
            ].map(({ icon: Icon, label, href, color }) => (
              <Link
                key={label}
                href={href}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border font-semibold text-sm ${color} hover:scale-105 transition-transform shadow-sm`}
              >
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Ready for your next <span className="gradient-text">adventure?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of thrill-seekers who've discovered Maharashtra's hidden gems through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105 shadow-lg"
            >
              <Compass className="w-5 h-5" /> Find Adventures
            </Link>
            <Link
              href="/operator-register"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105"
            >
              List Your Experience
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
