import { test, expect, _electron as electron } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import path from 'path'
import os from 'os'
import fs from 'fs'

let electronApp: ElectronApplication
let page: Page
let tempUserDataDir: string

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
    tempUserDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mycelo-e2e-base-'))

    electronApp = await electron.launch({
        args: [
            path.join(__dirname, '../out/main/index.js'),
            `--user-data-dir=${tempUserDataDir}`,
        ],
    })
    page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
})

test.afterAll(async () => {
    await electronApp.close()
    fs.rmSync(tempUserDataDir, { recursive: true, force: true })
})

test('window has correct title', async () => {
    const title = await page.title()
    expect(title).toContain('myCelo')
})

test('shows add log location prompt when no settings', async () => {
    await expect(
        page.getByText('Please, in settings specify location log file')
    ).toBeVisible()
})

test('settings icon opens settings view', async () => {
    await page.getByRole('img', { name: 'settings' }).click();
    await expect(page.locator('select').first()).toBeVisible()
})

test('close button exits settings view', async () => {
    await page.locator('svg[data-icon="xmark"]').click()
    await expect(
        page.getByText('Please, in settings specify location log file')
    ).toBeVisible()
})

test('switching language to Russian changes UI text', async () => {
    await page.getByRole('img', { name: 'settings' }).click();

    await expect(page.locator('select').first()).toBeVisible()
    await page.locator('select').first().selectOption('ru')
    await expect(page.getByText('Язык')).toBeVisible()

    await page.locator('select').first().selectOption('en')
    await expect(page.getByText('Language')).toBeVisible()
})
