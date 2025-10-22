import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({
    template: {
      transformAssetUrls: {
        includeAbsolute: false,
      },
    },
  })],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  }
})