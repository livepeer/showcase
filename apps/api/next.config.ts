import { env } from "@repo/env";
import { config } from "@repo/next-config";
import type { NextConfig } from "next";

let nextConfig: NextConfig = { ...config };

export default nextConfig;
