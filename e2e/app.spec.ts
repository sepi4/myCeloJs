import { test, expect, _electron as electron } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import path from 'path'

let electronApp: ElectronApplication
let page: Page

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
    electronApp = await electron.launch({
        args: [path.join(__dirname, '../out/main/index.js')],
    })
    page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
})

test.afterAll(async () => {
    await electronApp.close()
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
    await page.locator('svg[data-icon="cogs"]').click()
    await expect(page.locator('select').first()).toBeVisible()
})

test('close button exits settings view', async () => {
    await page.locator('svg[data-icon="times"]').click()
    await expect(
        page.getByText('Please, in settings specify location log file')
    ).toBeVisible()
})

test('switching language to Russian changes UI text', async () => {
    await page.locator('svg[data-icon="cogs"]').click()

    await expect(page.locator('select').first()).toBeVisible()
    await page.locator('select').first().selectOption('ru')
    await expect(page.getByText('Язык')).toBeVisible()

    await page.locator('select').first().selectOption('en')
    await expect(page.getByText('Language')).toBeVisible()
})
