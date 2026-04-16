import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import { App, COH2_LOG_PATH, COH3_LOG_PATH, STEAM_ID } from './pom/App.pom'
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

    // Setup: set both COH2 and COH3 logs
    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH2_LOG_PATH)
    await app.logLocationButtonCoh2.click()
    await app.mockFileDialog(electronApp, COH3_LOG_PATH)
    await app.logLocationButtonCoh3.click()
    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()

    await app.checkboxTable.click()
    await app.checkboxTotal.click()
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('switch game while viewing player card', async () => {
    // Search for player in COH3 and open card
    await app.radioCoh3.click()
    await app.searchIcon.click()
    await app.searchInput.fill(STEAM_ID)
    await app.searchInput.press('Enter')
    await expect(app.foundPlayers.first()).toBeVisible()
    await app.foundPlayers.first().click()
    await expect(app.fetchHistory).toBeVisible()

    // Switch to COH2 — card should reload
    await app.radioCoh2.click()
    await expect(app.fetchHistory).toBeVisible()
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await expect(app.profileIdValue).toBeVisible()
    await expect(app.tableView).toBeVisible()
    await expect(app.totalGames).toBeVisible()

    // Switch back to COH3 — card should reload
    await app.radioCoh3.click()
    await expect(app.fetchHistory).toBeVisible()
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await expect(app.profileIdValue).toBeVisible()
    await expect(app.tableView).toBeVisible()
    await expect(app.totalGames).toBeVisible()

    await app.closeButton.click()
})
