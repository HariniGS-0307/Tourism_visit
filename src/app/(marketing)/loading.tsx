export default function HomeLoading() {
  return (
    <div className="flex flex-col min-h-screen animate-pulse">
      {/* Hero skeleton */}
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <div className="h-4 w-64 bg-white/20 rounded-full mx-auto" />
          <div className="h-20 w-[28rem] max-w-full bg-white/20 rounded-2xl mx-auto" />
          <div className="h-6 w-96 max-w-full bg-white/15 rounded mx-auto" />
          <div className="flex gap-4 justify-center">
            <div className="h-14 w-44 bg-emerald-500/30 rounded-full" />
            <div className="h-14 w-44 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
      {/* Cards skeleton */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-5 w-32 bg-gray-200 rounded mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl" style={{ height: i % 3 === 0 ? 280 : 220 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
