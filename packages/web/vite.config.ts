import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';
import visualizer from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components';


function resolve(dir: string = '') {
  return path.resolve(__dirname, dir);
}

const plugins = [
  vue(),
  ViteComponents({
    customComponentResolvers: [AntDesignVueResolver()]
  })
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    viteCompression(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  );
}

export default defineConfig({
  plugins,
  resolve: {
    // 自定义路径别名
    alias: {
      '@': resolve('src'),
      style: resolve('src/style'),
      comps: resolve('src/components'),
      utils: resolve('src/utils'),
      request: resolve('src/request')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: '@import "./src/style/variable.scss";'
      }
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '^/baseApi': {
        target: 'http://0.0.0.0:1129',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/baseApi/, '')
      }
    }
  }
})
