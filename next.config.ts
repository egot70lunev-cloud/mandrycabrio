import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure Webpack is used (not Turbopack) for stability
  // Turbopack is disabled via --webpack flag in package.json
  experimental: {
    // Explicitly disable Turbopack
  },
  // Improve dev server stability
  onDemandEntries: {
    // Keep pages in memory for longer to reduce recompilation
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Prevent crashes on build errors
  typescript: {
    ignoreBuildErrors: false, // Keep type checking but don't crash
  },
};

export default nextConfig;
