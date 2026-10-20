import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// During development, requests to /books are forwarded to the Spring Boot API
// running on port 8080. This avoids CORS errors without changing the API.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/books': 'http://localhost:8080',
    },
  },
})
