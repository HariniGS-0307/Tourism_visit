import Link from "next/link";
import { MapPin, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-black text-emerald-600 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 border border-emerald-600 font-bold py-3 px-6 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            <MapPin className="w-4 h-4" /> Explore
          </Link>
        </div>
      </div>
    </div>
  );
}
