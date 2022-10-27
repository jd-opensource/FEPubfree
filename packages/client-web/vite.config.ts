import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    USE_V_CONSOLE: true,
    SERVER_URL: JSON.stringify('http://127.0.0.1:7001'),
    SERVER_DOMAIN: JSON.stringify('beta-pf.jd.com'),
    DOMAIN_SUFFIX: JSON.stringify('.pubfree.jd.com'),
  },
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
