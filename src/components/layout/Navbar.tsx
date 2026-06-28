import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserMenu from "./UserMenu";
import MobileNav from "./MobileNav";
import NavLinks from "./NavLinks";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/80 sticky top-0 z-50 transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">

          {/* Left: Logo + Nav links */}
          <div className="flex items-center gap-1">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2 mr-4 group" aria-label="Maharashtra Adventures Home">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-emerald-500 transition-colors group-hover:shadow-emerald-500/30 group-hover:shadow-lg">
                {/* Inline SVG — identical on server and client, no hydration mismatch */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white" aria-hidden="true">
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                </svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 hidden sm:block">
                Maha<span className="text-emerald-600">Adventures</span>
              </span>
            </Link>
            <NavLinks />
          </div>

          {/* Right: Auth */}
          <div className="flex items-center gap-2">
            {session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-500 transition-all hover:shadow-emerald-500/25 hover:shadow-md"
                >
                  Sign up free
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
