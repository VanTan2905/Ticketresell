import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["media.stubhubstatic.com","lh3.googleusercontent.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_DEST || "http://api:8080/api/:path*",
      },
      {
        source: "/chat-hub",
        destination: process.env.NEXT_PUBLIC_SIGNALR_DEST || "http://api:8080/chat-hub",
      },
    ];
  },
};

export default nextConfig;
