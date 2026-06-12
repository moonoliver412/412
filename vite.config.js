import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA: offline app shell. registerType 'prompt' — never hot-swap the
    // service worker under a learner mid-keystroke; UpdatePill asks first.
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'og-card.png'],
      manifest: {
        name: 'CodeSprout',
        short_name: 'CodeSprout',
        description:
          'Grow a forest while you learn to code. Every topic is a tree.',
        theme_color: '#c5d2c2',
        background_color: '#c5d2c2',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // The whole curriculum is bundled JS, so precaching the shell makes
        // every lesson work offline.
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
    }),
  ],
})
