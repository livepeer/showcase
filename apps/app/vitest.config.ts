import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/__tests__/**/*.{test,spec}.{ts,tsx}'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname),
      '@/lib': resolve(__dirname, './lib'),
      '@/components': resolve(__dirname, './components'),
      '@/hooks': resolve(__dirname, './hooks'),
      '@/app': resolve(__dirname, './app'),
      '@repo/design-system': resolve(__dirname, '../../packages/design-system'),
      '@repo/env': resolve(__dirname, '../../packages/env'),
      '@repo/supabase': resolve(__dirname, '../../packages/supabase'),
    },
  },
});
