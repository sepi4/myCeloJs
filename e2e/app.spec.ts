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
    tempUserDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mycelo-e2e-'))

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

test('set log location and verify players appear', async () => {
    // Fresh start — no settings, prompt should be visible
    await expect(
        page.getByText('Please, in settings specify location log file')
    ).toBeVisible()

    // Open settings
    await page.getByRole('img', { name: 'settings' }).click()
    await expect(page.locator('select').first()).toBeVisible()

    // Mock the native file dialog to return the example log path
    const logPath = path.join(__dirname, '../dataExamples/warnings.log')
    await electronApp.evaluate(async ({ dialog }, filePath) => {
        dialog.showOpenDialog = () =>
            Promise.resolve({ canceled: false, filePaths: [filePath] })
    }, logPath)

    // Click the log location select button and close settings
    await page.getByRole('button', { name: 'select' }).click()
    await page.locator('svg[data-icon="xmark"]').click()

    // Players from the example log should now be visible
    await expect(page.getByText('Unknown')).toBeVisible()
})

test('switch language to Russian and back to English', async () => {
    // Open settings and switch to Russian
    await page.getByRole('img', { name: 'settings' }).click()
    await expect(page.locator('select').first()).toBeVisible()
    await page.locator('select').first().selectOption('ru')

    // Verify Russian language in settings
    await expect(page.getByText('Язык')).toBeVisible()

    // Close settings and verify Russian on main view
    await page.locator('svg[data-icon="xmark"]').click()
    await expect(page.getByText('авто')).toBeVisible()

    // Open settings again and switch back to English
    await page.getByRole('img', { name: 'настройки' }).click()
    await expect(page.locator('select').first()).toBeVisible()
    await page.locator('select').first().selectOption('en')
    await expect(page.getByText('Language')).toBeVisible()
})

test('steam id validation and player card', async () => {
    test.setTimeout(60_000)

    // Still in settings from the previous test — enter an invalid steam ID
    await page.getByRole('textbox').fill('12345')
    await page.getByRole('button', { name: 'save' }).click()
    await expect(page.getByText('ID is wrong')).toBeVisible()

    // Enter the correct steam ID — requires an API call to validate and store profileId
    await page.getByRole('textbox').fill('76561198006675368')
    await page.getByRole('button', { name: 'save' }).click()
    await expect(page.getByText('ID set')).toBeVisible()

    // Close settings
    await page.locator('svg[data-icon="xmark"]').click()

    // User icon should appear on navbar now that steamId is set
    const userIcon = page.getByRole('img', { name: 'my playercard' })
    await expect(userIcon).toBeVisible()

    // Click it — triggers getExtraInfo API call, then opens player card
    await userIcon.click()
    await expect(page.getByText('76561198006675368')).toBeVisible()

    // Close player card
    await page.locator('svg[data-icon="xmark"]').click()
    await expect(userIcon).toBeVisible()
})

// await page.pause()