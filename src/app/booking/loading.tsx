export default function BookingLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center animate-pulse">
      <div className="w-full max-w-2xl mx-auto px-4 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="h-12 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
