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

test('COH2 radio button is selected by default', async () => {
    await expect(page.locator('#coh2')).toBeChecked()
})

test('COH3 radio button is unchecked by default', async () => {
    await expect(page.locator('#coh3')).not.toBeChecked()
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

test('settings view has language selector with EN and RU options', async () => {
    const select = page.locator('select').first()
    await expect(select.locator('option[value="en"]')).toHaveText('EN')
    await expect(select.locator('option[value="ru"]')).toHaveText('RU')
})

test('close button exits settings view', async () => {
    await page.locator('svg[data-icon="times"]').click()
    await expect(
        page.getByText('Please, in settings specify location log file')
    ).toBeVisible()
})

test('COH3 radio can be selected', async () => {
    await page.locator('#coh3').click()
    await expect(page.locator('#coh3')).toBeChecked()
    await expect(page.locator('#coh2')).not.toBeChecked()
})

test('switching back to COH2 works', async () => {
    await page.locator('#coh2').click()
    await expect(page.locator('#coh2')).toBeChecked()
})
