import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true, // надо для WebSocket
      },
    },
  },
  resolve: {
  alias: { '@shared': path.resolve(import.meta.dirname, '../shared') },
}
})
