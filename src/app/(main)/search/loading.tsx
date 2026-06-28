export default function SearchLoading() {
  return (
    <div className="bg-gray-50 min-h-screen pb-12 animate-pulse">
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="h-4 w-40 bg-gray-200 rounded mx-auto mb-3" />
          <div className="h-9 w-56 bg-gray-200 rounded-xl mx-auto mb-6" />
          <div className="h-12 bg-gray-200 rounded-2xl w-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <div className="h-5 w-24 bg-gray-200 rounded" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full" />
              ))}
            </div>
          </div>
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-4/5" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
