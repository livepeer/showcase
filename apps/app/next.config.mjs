const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "*.github.com",
      },
      {
        protocol: "https",
        hostname: "fabowvadozbihurwnvwd.supabase.co",
      },
      {
        protocol: "https",
        hostname: "example.com",
      }
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default config;
