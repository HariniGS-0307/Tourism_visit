export default function ExploreLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Hero skeleton */}
      <div className="relative h-screen min-h-[600px] bg-gray-800 flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <div className="h-4 w-48 bg-white/20 rounded mx-auto" />
          <div className="h-16 w-80 bg-white/20 rounded-xl mx-auto" />
          <div className="h-6 w-64 bg-white/15 rounded mx-auto" />
        </div>
      </div>

      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 w-36 bg-gray-200 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 bg-gray-800 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
