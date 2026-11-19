import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Serve the manifest from `bun dev` too, so an icon added over the ngrok tunnel installs as the app.
      devOptions: { enabled: true },
      manifest: {
        name: 'Fitra',
        short_name: 'Fitra',
        description: 'Gym and food tracking',
        theme_color: '#ff7a1a',
        background_color: '#f3f4f6',
        display: 'standalone',
        start_url: '/',
        // Whole site is the app; a link outside the scope makes iOS show the browser bar.
        scope: '/',
        icons: [
          { src: '/fitra-favicon/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/fitra-favicon/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Lets ngrok tunnels reach the dev server (Vite blocks unknown hosts by default).
  server: {
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app'],
  },
})
