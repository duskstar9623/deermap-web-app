import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // 启动 react 支持，解析 JSX 语法
    react(),
    // 将 SVG 文件作为 React 组件导入
    svgr({
      svgrOptions: {
        icon: true,
        svgoConfig: {
          plugins: [{ name: 'removeViewBox', active: false }],
        },
      }
    })
  ],
  resolve: {
    // 路径别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 手动分包策略
        manualChunks: {
          // 核心运行时，极少变动，可长期命中浏览器缓存
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // 仅在需要多语言时加载，减少初始包体积
          i18n: ['i18next', 'react-i18next'],
          // 图表库和动画库，按需加载，提升性能
          recharts: ['recharts'],
          'framer-motion': ['framer-motion'],
        },
      },
    },
  },
})
