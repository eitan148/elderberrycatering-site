import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  trailingSlash: true,
  async rewrites() {
    return [
      // /category/foo/ → /category-foo/   (source URLs use a sub-path, content store uses flat slug)
      { source: "/category/:slug/", destination: "/category-:slug/" },
      { source: "/category/:slug", destination: "/category-:slug" },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "www.elderberrycatering.com" },
      { protocol: "https", hostname: "elderberrycatering.com" },
      { protocol: "https", hostname: "secure.gravatar.com" },
    ],
  },
};

export default nextConfig;
