import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() //use tailwindcss
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  //Set the path
    },
  },
  server: {
    port : 5174,
    proxy: {
      '/api': 'http://localhost:5000',
    },
    hmr: {
      overlay: false, // disable error overlay in browser
    },
  },
})
