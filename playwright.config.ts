import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    timeout: 30000,
    retries: 2,
    workers: 4,
    reporter: 'html',
    use: {
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
})
