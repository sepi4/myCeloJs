import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    timeout: 30000,
    retries: 1,
    workers: 12,
    reporter: [['line'], ['html', { open: 'never' }]],
    use: {
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
})
