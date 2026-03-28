import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Mi Clínica Podológica',
        short_name: 'MCP',
        description: 'Sistema completo de gestión clínica podológica',
        theme_color: '#0F766E',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [{
          urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'firebase-storage',
            expiration: { maxEntries: 100, maxAgeSeconds: 2592000 }
          }
        }]
      }
    })
  ]
})
