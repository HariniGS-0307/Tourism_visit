/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Compression ───────────────────────────────────────────────────────────
  compress: true,

  // ── Powered by header ─────────────────────────────────────────────────────
  poweredByHeader: false,

  // ── transpilePackages forces lucide-react through Next.js babel/SWC
  // transform, ensuring the same code path on server and client —
  // eliminates the CJS vs ESM SVG hydration mismatch.
  transpilePackages: ["lucide-react"],

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
  },

  // ── Experimental performance flags ────────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      "@google/generative-ai",
      "date-fns",
      "@prisma/client",
    ],
  },

  // ── Development server configuration ───────────────────────────────────────
  allowedDevOrigins: ["127.0.0.1"],

  // ── Build optimizations ────────────────────────────────────────────────────
  swcMinify: true,
  reactStrictMode: true,
};

export default nextConfig;
