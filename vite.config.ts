import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const PLAY_SERVER = process.env.VITE_PLAY_SERVER_PROXY ?? 'http://127.0.0.1:8080'

/** Dev-only: same-origin /api + core /assets/* → play-server (avoids CORS on move commands). */
const coreAssetProxy = Object.fromEntries(
  ['locations', 'characters', 'items', 'ui', 'showcase', 'models', 'audio'].map((segment) => [
    `/assets/${segment}`,
    { target: PLAY_SERVER, changeOrigin: true },
  ]),
)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': { target: PLAY_SERVER, changeOrigin: true },
      ...coreAssetProxy,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'motion'
        },
      },
    },
  },
})
