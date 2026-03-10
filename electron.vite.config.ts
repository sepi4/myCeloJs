import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/main/index.ts'),
                },
            },
        },
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/preload/index.ts'),
                },
            },
        },
    },
    renderer: {
        root: resolve(__dirname, 'src'),
        plugins: [react()],
        optimizeDeps: {
            include: ['howler'],
        },
        build: {
            outDir: resolve(__dirname, 'out/renderer'),
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/index.html'),
                },
            },
        },
    },
})
