import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { generateMessagingSw } from './scripts/generate-messaging-sw.ts'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [generateMessagingSw(), react(), tailwindcss()],
  server: {
    port: 3000,
  },
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      '~': path.resolve(rootDir, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
