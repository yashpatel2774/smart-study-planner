import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), 
    tailwindcss(),
     VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"]
      },
      manifest: {
        name: 'Smart Study Planner',
        short_name: 'StudyPlanner',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
      icons: [
        {
          src: "/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
      }
    })
  ],
})
