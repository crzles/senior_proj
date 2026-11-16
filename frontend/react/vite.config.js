import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // The backend's .env (in the project root) also holds the Google Maps key for the frontend.
  // Use the frontend's own env files first, then fall back to the root one.
  const ownEnv = loadEnv(mode, '.', 'VITE_')
  const rootEnv = loadEnv(mode, '../..', 'VITE_')
  const mapsKey = ownEnv.VITE_GOOGLE_MAPS_API_KEY || rootEnv.VITE_GOOGLE_MAPS_API_KEY || ''

  return {
  define: {
    'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(mapsKey),
  },
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
}
})
