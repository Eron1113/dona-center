import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix workspace root detection (Next.js was picking up a stray lockfile in
  // the home directory). Point Turbopack at this project's root explicitly.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
