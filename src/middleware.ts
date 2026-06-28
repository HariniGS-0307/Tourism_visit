import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const role = req.nextauth.token?.role;

    if (path.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (path.startsWith("/dashboard/operator") && role !== "OPERATOR" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
