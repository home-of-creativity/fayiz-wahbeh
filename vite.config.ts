import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';
import { fileURLToPath, URL } from 'node:url';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.GITHUB_ACTIONS === 'true' && repository ? `/${repository}/` : '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    imagetools({
      // `?responsive` → AVIF + WebP srcsets rendered through <Picture>.
      defaultDirectives: (url) => {
        if (url.searchParams.has('responsive')) {
          return new URLSearchParams({
            w: '480;800;1200;1440',
            format: 'avif;webp',
            quality: '60',
            as: 'picture',
          });
        }
        // `?texture` → one mid-size WebP URL, used as a CSS background.
        if (url.searchParams.has('texture')) {
          return new URLSearchParams({ w: '900', format: 'webp', quality: '55' });
        }
        return new URLSearchParams();
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.split('\\').join('/');
          if (!normalized.includes('node_modules')) return;
          if (normalized.includes('/gsap/') || normalized.includes('/@gsap/')) return 'gsap';
          if (normalized.includes('/i18next')) return 'i18n';
          if (normalized.includes('/react-dom/') || normalized.includes('/react/')) return 'react';
        },
      },
    },
  },
});
