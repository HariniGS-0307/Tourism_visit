export default function DestinationsLoading() {
  return (
    <div className="bg-gray-50 min-h-screen animate-pulse">
      <div className="bg-gradient-to-b from-emerald-900 to-gray-900 h-64 flex items-end pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="h-10 w-56 bg-white/20 rounded-xl mb-3" />
          <div className="h-5 w-80 bg-white/15 rounded" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-72 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
