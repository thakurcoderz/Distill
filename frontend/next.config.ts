import type { NextConfig } from "next";

// BACKEND_URL is a server-only env var (no NEXT_PUBLIC_ prefix).
// In Docker it is set to http://backend:8000 by docker-compose so the Next.js
// server talks to the backend container directly over the internal network.
// For local dev it falls back to http://localhost:8000.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/transcript/:path*",
        destination: `${BACKEND_URL}/transcript/:path*`,
      },
      {
        source: "/ai/:path*",
        destination: `${BACKEND_URL}/ai/:path*`,
      },
      {
        source: "/health",
        destination: `${BACKEND_URL}/health`,
      },
    ];
  },
};

export default nextConfig;
