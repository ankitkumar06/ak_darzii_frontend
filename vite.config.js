import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: process.env.PORT || 5001, // change this to any port you like
    open: true , // automatically opens browser,
    // proxy: {
    //   '/api': process.env.REACT_APP_API_LINK || 'http://localhost:5000'
    // }
  }
})
