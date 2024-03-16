import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  ,
  server: {
    proxy: {
      '/api': { // 获取路徑中包含了/api的請求
        target: 'http://localhost:8080', // 後臺服務所在的源
        changeOrigin: true, // 修改源
        rewrite: (path) => path.replace(/^\/api/, '') // /api替換為''
      }
    }
  }
})
