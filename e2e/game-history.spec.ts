import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import { App, COH2_LOG_PATH, STEAM_ID } from './pom/App.pom'
import { launchApp, closeApp } from './setup'

let electronApp: ElectronApplication
let page: Page
let app: App
let tempUserDataDir: string

test.beforeAll(async () => {
    const result = await launchApp()
    electronApp = result.electronApp
    page = result.page
    app = result.app
    tempUserDataDir = result.tempUserDataDir

    // Setup: set COH2 log and steam ID so player card is available
    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH2_LOG_PATH)
    await app.logLocationButtonCoh2.click()
    await app.steamIdInput.fill(STEAM_ID)
    await app.steamIdSave.click()
    await expect(app.steamIdSuccess).toBeVisible()
    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('fetch game history and open game modal', async () => {
    // Open my player card
    await app.userIcon.click()
    await expect(app.steamIdValue).toBeVisible()

    // Click fetch game history button — triggers API call
    await expect(app.fetchHistory).toBeVisible()
    await app.fetchHistory.click()

    // Game history items should load
    await expect(app.gameHistory).toBeVisible()
    await expect(app.gameHistoryItems.first()).toBeVisible()

    // Click the first game to open the modal
    await app.gameHistoryItems.first().click()
    await expect(app.gameModal).toBeVisible()
    await expect(app.gameStart).toBeVisible()
    await expect(app.gameEnd).toBeVisible()

    // Close the modal with Escape
    await page.keyboard.press('Escape')
    await expect(app.gameModal).not.toBeVisible()
})
