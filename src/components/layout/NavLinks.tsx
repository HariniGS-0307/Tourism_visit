"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/destinations", label: "Destinations" },
  { href: "/activities", label: "Activities" },
  { href: "/search", label: "Search" },
];

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center gap-1">
      {NAV_LINKS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              active
                ? "text-emerald-600 bg-emerald-50"
                : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            {label}
            {active && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full" />
            )}
          </Link>
        );
      })}

      <Link
        href="/search"
        className="ml-1 hidden lg:flex w-9 h-9 items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Search adventures"
      >
        <SearchIcon />
      </Link>
    </div>
  );
}
