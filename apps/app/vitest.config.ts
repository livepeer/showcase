import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      "@repo/design-system": resolve(__dirname, "../../packages/design-system"),
      "@repo/typescript-config": resolve(__dirname, "../../packages/typescript-config"),
      "@repo/tailwind-config": resolve(__dirname, "../../packages/tailwind-config"),
    },
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
