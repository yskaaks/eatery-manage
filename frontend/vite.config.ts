import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  server: { 
    host: "0.0.0.0",
    // proxy: { 
    //   '/api': ' http://localhost/api'
    // }
  },
})