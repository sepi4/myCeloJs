import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        setupFiles: ['src/testSetup.ts'],
        coverage: {
            provider: 'v8',
            include: ['src/functions/**/*.ts', 'src/stores/**/*.ts'],
            exclude: ['src/**/*.d.ts'],
            reporter: ['text', 'html'],
        },
    },
})
