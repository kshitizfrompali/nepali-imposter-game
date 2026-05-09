import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'logo.webp', 'result.webp'],
      manifest: {
        name: 'Nepali Imposter',
        short_name: 'Nepali Imposter',
        description: 'धोकेबाज हौ तिमी? — A Nepali pass-and-play imposter party game.',
        lang: 'en',
        theme_color: '#7c3aed',
        background_color: '#0d0d1a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/nepali-imposter-game/',
        start_url: '/nepali-imposter-game/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,ico,woff2}'],
        navigateFallback: '/nepali-imposter-game/index.html',
      },
    }),
  ],
  base: '/nepali-imposter-game/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
