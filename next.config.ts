import type { NextConfig } from "next";

const supabaseHostname =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
    } catch {
      return undefined;
    }
  })();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "bvnicfhaelnphavxndwm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      ...(supabaseHostname &&
      supabaseHostname !== "bvnicfhaelnphavxndwm.supabase.co"
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
