import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    // Disable Next.js scroll restoration so we can handle it manually
    scrollRestoration: true,
  },
  rewrites: async () => {
    return [
      {
        source: "/beta/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/beta/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
