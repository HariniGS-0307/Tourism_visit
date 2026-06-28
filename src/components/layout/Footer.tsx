import Link from "next/link";
import { Mountain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="h-7 w-7 text-emerald-500" />
              <span className="font-bold text-lg text-white">MahaAdventures</span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm">
              Discover, compare, and book adventure experiences across Maharashtra — treks, camping, water sports, and more.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/explore" className="hover:text-white transition-colors">Destinations</Link></li>
              <li><Link href="/activities" className="hover:text-white transition-colors">Activities</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Search</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Compare</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/operator-register" className="hover:text-white transition-colors">List Your Adventures</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Maharashtra Adventures. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
