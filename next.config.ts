import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
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

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

export default withPWA(nextConfig);
