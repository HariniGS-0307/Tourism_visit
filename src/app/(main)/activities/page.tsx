import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { getCategoryImage } from "@/lib/images";

import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Activities | Maharashtra Adventures",
  description: "Browse adventure activities across Maharashtra — trekking, camping, wildlife safaris, water sports and more.",
};

const getCachedCategories = unstable_cache(
  () =>
    prisma.category.findMany({
      include: { _count: { select: { listings: { where: { status: "PUBLISHED" } } } } },
      orderBy: { name: "asc" },
    }),
  ["all-categories"],
  { revalidate: 300 }
);

const FALLBACK_IMAGES: Record<string, string> = {
  trekking: getCategoryImage("trekking"),
  camping: getCategoryImage("camping"),
  "water-sports": getCategoryImage("water-sports"),
  "wildlife-safari": getCategoryImage("wildlife-safari"),
  cycling: getCategoryImage("cycling"),
  paragliding: getCategoryImage("paragliding"),
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  trekking: "from-green-900/85",
  camping: "from-orange-900/85",
  "water-sports": "from-blue-900/85",
  "wildlife-safari": "from-amber-900/85",
  cycling: "from-purple-900/85",
  paragliding: "from-sky-900/85",
  "rock-climbing": "from-red-900/85",
  kayaking: "from-cyan-900/85",
  "scuba-diving": "from-teal-900/85",
  "bird-watching": "from-lime-900/85",
};

export default async function ActivitiesPage() {
  const categories = await getCachedCategories();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">Find your thrill</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Browse by Activity
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From high-altitude Sahyadri treks to scuba diving on the Konkan coast — find exactly the adventure you&apos;re after.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No activities found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const imgUrl = cat.icon || FALLBACK_IMAGES[cat.slug] || FALLBACK_IMAGES.trekking;
              const gradient = CATEGORY_GRADIENTS[cat.slug] || "from-gray-900/85";
              return (
                <Link
                  key={cat.id}
                  href={`/activities/${cat.slug}`}
                  className="group relative h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover"
                >
                  <Image
                    src={imgUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${gradient} via-transparent to-transparent`} />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-2xl font-extrabold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-200 line-clamp-2 max-w-[200px]">{cat.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                          {cat._count.listings} active
                        </span>
                        <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors text-white text-lg">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

