import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Enable the App Router (if using Next.js 13+)
  experimental: {
    
    // Add supported experimental options here if needed
  },
  
  // Ensure proper handling of static files
  images: {
    unoptimized: true, // If you're using next/image
  },
  
  // Disable ESLint during build (optional)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript errors during build (optional)
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
