import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  optimizeDeps: {
    include: ['three'],
  },
  build: {
    rollupOptions: {
      external: [], // ensure 'three' is not externalized
    },
  },
})
