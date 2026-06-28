"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/destinations", label: "Destinations" },
  { href: "/activities", label: "Activities" },
  { href: "/search", label: "Search" },
];

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />
          <div className="absolute top-16 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-lg">
            <nav className="flex flex-col p-4 gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
