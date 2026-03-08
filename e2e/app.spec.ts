import { test, expect, _electron as electron } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { AppPage, LOG_PATH, STEAM_ID } from './pages/AppPage'

let electronApp: ElectronApplication
let page: Page
let app: AppPage
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
    app = new AppPage(page)
})

test.afterAll(async () => {
    await electronApp.close()
    fs.rmSync(tempUserDataDir, { recursive: true, force: true })
})

test('set log location and verify players appear', async () => {
    // Fresh start — no settings, prompt should be visible
    await expect(app.noLogPrompt).toBeVisible()

    // Open settings and mock the native file dialog
    await app.settingsIcon.click()
    await expect(app.languageSelect).toBeVisible()
    await app.mockFileDialog(electronApp, LOG_PATH)

    // Select the log file and return to main view
    await app.logLocationButton.click()
    await app.closeButton.click()

    // Players parsed from the example log should now be visible
    await expect(app.playersContainer).toBeVisible()
})

test('switch language to Russian and back to English', async () => {
    // Open settings and switch to Russian
    await app.settingsIcon.click()
    await expect(app.languageSelect).toBeVisible()
    await app.languageSelect.selectOption('ru')

    // Verify Russian label is shown in settings
    await expect(app.languageTitle).toHaveText('Язык')

    // Close settings and verify Russian text on main view
    await app.closeButton.click()
    await expect(app.autoLabel).toHaveText('авто')

    // Open settings again and switch back to English
    await app.settingsIcon.click()
    await app.languageSelect.selectOption('en')
    await expect(app.languageTitle).toHaveText('Language')
})

test('steam id validation and player card', async () => {

    // Still in settings from the previous test — enter an invalid steam ID
    await app.steamIdInput.fill('12345')
    await app.steamIdSave.click()
    await expect(app.steamIdError).toBeVisible()

    // Enter the correct steam ID — requires an API call to validate and store profileId
    await app.steamIdInput.fill(STEAM_ID)
    await app.steamIdSave.click()
    await expect(app.steamIdSuccess).toBeVisible()

    // Close settings
    await app.closeButton.click()

    // User icon should appear on the navbar now that steamId is set
    await expect(app.userIcon).toBeVisible()

    // Click it — triggers getExtraInfo API call, then opens player card
    await app.userIcon.click()
    await expect(app.steamIdValue).toHaveText(STEAM_ID)

    // Close player card
    await app.closeButton.click()
    await expect(app.userIcon).toBeVisible()
})

test('search by steam ID and open player card', async () => {
    // Open the search view from the navbar
    await app.searchIcon.click()
    await expect(app.searchInput).toBeVisible()

    // Type the steam ID and submit with Enter — triggers two API calls
    await app.searchInput.fill(STEAM_ID)
    await app.searchInput.press('Enter')

    // Exactly one player result should appear
    await expect(app.foundPlayers).toHaveCount(1)

    // Open that player's card
    await app.foundPlayers.click()
    await expect(app.steamIdValue).toHaveText(STEAM_ID)

    await page.pause()
})
