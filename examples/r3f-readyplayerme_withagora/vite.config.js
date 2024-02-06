import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import gltf from 'vite-plugin-gltf'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import inject from '@rollup/plugin-inject'

// This is required for Vite to work correctly with CodeSandbox
const server = process.env.APP_ENV === 'sandbox' ? { hmr: { clientPort: 443 } } : {}

// https://vitejs.dev/config/
export default defineConfig(async configEnv => {
  const glsl = (await import('vite-plugin-glsl')).default
  return {
    server: server,
    resolve: {
      alias: {
        '@src': resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
      },
    },
    plugins: [
      react(),
      glsl(),
      gltf(),
      nodePolyfills({
        globals: {
          Buffer: false,
        },
      }),
    ],
  }
})
