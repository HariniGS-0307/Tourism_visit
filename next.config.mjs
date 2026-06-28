/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Compression ───────────────────────────────────────────────────────────
  compress: true,

  // ── Powered by header ─────────────────────────────────────────────────────
  poweredByHeader: false,

  // ── Image optimisation ────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24 h
    deviceSizes: [375, 640, 768, 1024, 1280, 1920],
    imageSizes: [48, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ── Experimental performance flags ────────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      "@google/generative-ai",
      "date-fns",
      "@prisma/client",
    ],
    // Turbopack for faster dev builds
    // turbo: {},  // uncomment if using Next.js 15+
  },

  // ── Development server configuration ───────────────────────────────────────
  allowedDevOrigins: ["127.0.0.1"],

  // ── Build optimizations ────────────────────────────────────────────────────
  swcMinify: true,
  reactStrictMode: true,

  // ── HTTP response headers ─────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Static assets — cache for 1 year
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Images — cache aggressively
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Pages — stale-while-revalidate for snappy navigations
        source: "/((?!api|_next/static|_next/image|favicon).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
      {
        // API routes — no caching
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache",
          },
        ],
      },
    ];
  },

  // ── Redirects for common typos ────────────────────────────────────────────
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/trek",
        destination: "/activities/trekking",
        permanent: false,
      },
      {
        source: "/camp",
        destination: "/activities/camping",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
