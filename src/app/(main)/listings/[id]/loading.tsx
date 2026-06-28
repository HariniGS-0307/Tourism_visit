export default function ListingLoading() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full h-[50vh] min-h-[400px] bg-gray-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-4">
              <div className="flex gap-2">
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
                <div className="h-6 w-32 bg-gray-200 rounded-full" />
              </div>
              <div className="h-10 bg-gray-200 rounded-xl w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded mb-3 w-full last:w-2/3" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
              <div className="h-10 w-32 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded-xl" />
              <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
