export default function AdminDashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-9 bg-gray-200 rounded w-48 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-72 mb-10" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded-2xl" />
    </div>
  );
}
