"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function DashboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
function TicketIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
    </svg>
  );
}
function LogOutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dashboardHref =
    user.role === "ADMIN"
      ? "/dashboard/admin"
      : user.role === "OPERATOR"
      ? "/dashboard/operator"
      : "/dashboard/user";

  return (
    <div className="relative ml-3">
      <button
        type="button"
        className="flex items-center gap-x-1 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Open user menu"
      >
        {user.image ? (
          <Image className="h-8 w-8 rounded-full" src={user.image} alt={user.name ?? "User"} width={32} height={32} />
        ) : (
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-52 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-4 py-2 border-b text-sm text-gray-700">
              <p className="truncate font-medium">{user.name}</p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>

            {user.role === "USER" && (
              <Link href="/dashboard/user" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                <span className="mr-2"><TicketIcon /></span>My Bookings
              </Link>
            )}

            <Link href={dashboardHref} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
              <span className="mr-2"><DashboardIcon /></span>Dashboard
            </Link>

            <button onClick={() => { setIsOpen(false); signOut({ callbackUrl: "/" }); }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
              <span className="mr-2"><LogOutIcon /></span>Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
