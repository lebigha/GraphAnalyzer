import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Config pour Vercel - serverless functions
  serverExternalPackages: ["groq-sdk"],
};

export default nextConfig;
