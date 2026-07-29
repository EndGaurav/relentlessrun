import type { NextConfig } from "next";

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  process.env.CLERK_PUBLISHABLE_KEY ||
  "";

if (publishableKey && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = publishableKey;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: publishableKey,
  },

  // ── Webhook proxy ─────────────────────────────────────────
  // Razorpay webhook URL points to mountainrun.in (Vercel).
  // This rewrite forwards it to the Railway backend so the
  // Express handler can process the raw body + signature.
  async rewrites() {
    if (!apiUrl) return [];
    return [
      {
        source: "/api/payments/webhook",
        destination: `${apiUrl.replace(/\/+$/, "")}/api/payments/webhook`,
      },
    ];
  },

  // ── Image optimisation ───────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 200, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
    ],
  },

  // ── Compression ──────────────────────────────────────────
  compress: true,

  // ── Experimental perf ────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@clerk/nextjs",
    ],
  },
};

export default nextConfig;
