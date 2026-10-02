import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PillBug',
        short_name: 'PillBug',
        start_url: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
      }
  })],
  server: {
    proxy: {
      // anything starting with /api goes to FastAPI during development
      '/api': 'http://localhost:8000',
    },
  },
})
