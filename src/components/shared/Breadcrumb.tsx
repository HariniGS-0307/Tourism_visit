"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, Home } from "lucide-react";



interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  /** Show a standalone ← Back button (uses browser history) */
  showBack?: boolean;
  className?: string;
}

const AUTO_LABELS: Record<string, string> = {
  explore: "Explore",
  destinations: "Destinations",
  activities: "Activities",
  search: "Search",
  listings: "Listings",
  booking: "Booking",
  checkout: "Checkout",
  confirmation: "Confirmation",
  compare: "Compare",
  dashboard: "Dashboard",
  user: "My Account",
  operator: "Operator",
  admin: "Admin",
  bookings: "Bookings",
  analytics: "Analytics",
  new: "New Listing",
  login: "Login",
  register: "Register",
  about: "About",
  contact: "Contact",
};

function buildCrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  segments.forEach((seg, i) => {
    // Skip dynamic IDs (cuid-like) or slugs — show as parent context
    const isId = /^[a-z0-9]{20,}$/.test(seg) || seg.startsWith("BKG-");
    const label = isId ? "Detail" : AUTO_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
    const href = "/" + segments.slice(0, i + 1).join("/");
    crumbs.push({ label, href });
  });

  return crumbs;
}

export default function Breadcrumb({ items, showBack = true, className = "" }: BreadcrumbProps) {
  const pathname = usePathname();
  const router = useRouter();
  const crumbs = items ?? buildCrumbs(pathname);

  if (crumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-3 text-sm ${className}`}
    >
      {showBack && (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-600 font-medium transition-colors group mr-2"
          aria-label="Go back"
        >
          <span className="w-7 h-7 bg-gray-100 group-hover:bg-emerald-50 rounded-lg flex items-center justify-center transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </span>
          <span className="hidden sm:inline">Back</span>
        </button>
      )}

      <ol className="flex items-center gap-1 flex-wrap">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {i === 0 ? (
                <Link
                  href={crumb.href}
                  className="text-gray-400 hover:text-emerald-600 transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-3.5 h-3.5" />
                </Link>
              ) : isLast ? (
                <span className="text-gray-700 font-semibold">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-gray-400 hover:text-emerald-600 transition-colors">
                  {crumb.label}
                </Link>
              )}
              {!isLast && <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

