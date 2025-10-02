import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    port: 5173, // Your frontend port
    proxy: {
      // String shorthand for simple proxy
      '/api': {
        target: 'http://localhost:5001', // Your backend server address
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // Set to false if your backend is not using HTTPS
      },
    },
  },
})
