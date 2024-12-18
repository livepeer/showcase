import { config as baseConfig } from "@repo/next-config";

const config = {
  ...baseConfig,
  images: {
    ...baseConfig.images,
    remotePatterns: [
      ...(baseConfig.images?.remotePatterns || []),
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "fabowvadozbihurwnvwd.supabase.co",
      },
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default config;
