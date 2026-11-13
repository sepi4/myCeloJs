import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import { App, COH2_LOG_PATH, COH3_LOG_PATH, STEAM_ID } from './pom/App.pom'
import { launchApp, closeApp } from './setup'

test.describe('COH2 game history', () => {
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

    test('fetch game history and open game details', async () => {
        // Open my player card
        await app.userIcon.click()
        await expect(app.steamIdValue).toBeVisible()

        // Click game history toggle — triggers API call
        await expect(app.gameHistoryToggle).toBeVisible()
        await app.gameHistoryToggle.click()

        // Game history items should load
        await expect(app.gameHistory).toBeVisible()
        await expect(app.gameHistoryRows.first()).toBeVisible()

        // Period filter: week may hide every game, all shows them again
        await app.gameHistoryPeriodWeek.click()
        await expect(app.gameHistoryPeriodWeek).toHaveAttribute('aria-pressed', 'true')
        await app.gameHistoryPeriodAll.click()
        await expect(app.gameHistoryPeriodAll).toHaveAttribute('aria-pressed', 'true')
        await expect(app.gameHistoryRows.first()).toBeVisible()

        // Toggle hides the history and shows it again
        await app.gameHistoryToggle.click()
        await expect(app.gameHistory).not.toBeVisible()
        await app.gameHistoryToggle.click()
        await expect(app.gameHistoryRows.first()).toBeVisible()

        // Click the first game to open its details below the row
        await app.gameHistoryRows.first().click()
        await expect(app.gameDetails).toBeVisible()
        await expect(app.gameTime).toBeVisible()

        // Opening another game closes the previous one
        await app.gameHistoryRows.nth(1).click()
        await expect(app.gameDetails).toHaveCount(1)

        // Clicking the same game again closes the details
        await app.gameHistoryRows.nth(1).click()
        await expect(app.gameDetails).not.toBeVisible()
        await expect(app.steamIdValue).toBeVisible()

        // Escape closes the player card and returns to the main view
        await page.keyboard.press('Escape')
        await expect(app.steamIdValue).not.toBeVisible()
        await expect(app.playersContainer).toBeVisible()
    })

    test('open a player card from a name in the game row', async () => {
        await app.userIcon.click()
        await expect(app.steamIdValue).toHaveText(STEAM_ID)
        const myName = (await app.playerCardName.textContent()) ?? ''
        if (!(await app.gameHistory.isVisible())) {
            await app.gameHistoryToggle.click()
        }
        await expect(app.gameHistoryRows.first()).toBeVisible()
        await expect(app.gameDetails).not.toBeVisible()

        const otherPlayer = app.gameHistoryPlayers.filter({ hasNotText: myName }).first()
        const otherName = (await otherPlayer.textContent()) ?? ''
        await otherPlayer.click()
        await expect(app.steamIdValue).not.toHaveText(STEAM_ID)
        await expect(app.playerCardName).toHaveText(otherName)

        // Back restores my card as it was: the name click did not open the game details
        await app.backButton.click()
        await expect(app.steamIdValue).toHaveText(STEAM_ID)
        await expect(app.gameHistoryRows.first()).toBeVisible()
        await expect(app.gameDetails).not.toBeVisible()

        await page.keyboard.press('Escape')
        await expect(app.playersContainer).toBeVisible()
    })
})

test.describe('COH3 game history', () => {
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

        // Setup: set COH3 log (profile ID and steam ID are extracted from the log)
        await app.settingsIcon.click()
        await app.mockFileDialog(electronApp, COH3_LOG_PATH)
        await app.logLocationButtonCoh3.click()
        await app.closeButton.click()
        await expect(app.playersContainer).toBeVisible()
    })

    test.afterAll(async () => {
        await closeApp(electronApp, tempUserDataDir)
    })

    test('fetch game history and open game details', async () => {
        // Open my player card
        await app.userIcon.click()
        await expect(app.steamIdValue).toBeVisible()

        // Click game history toggle — triggers API call
        await expect(app.gameHistoryToggle).toBeVisible()
        await app.gameHistoryToggle.click()

        // Game history items should load
        await expect(app.gameHistory).toBeVisible()
        await expect(app.gameHistoryRows.first()).toBeVisible()

        // Click the first game to open its details below the row
        await app.gameHistoryRows.first().click()
        await expect(app.gameDetails).toBeVisible()
        await expect(app.gameTime).toBeVisible()

        // Opening another game closes the previous one
        await app.gameHistoryRows.nth(1).click()
        await expect(app.gameDetails).toHaveCount(1)

        // Clicking the same game again closes the details
        await app.gameHistoryRows.nth(1).click()
        await expect(app.gameDetails).not.toBeVisible()
        await expect(app.steamIdValue).toBeVisible()

        // Escape closes the player card and returns to the main view
        await page.keyboard.press('Escape')
        await expect(app.steamIdValue).not.toBeVisible()
        await expect(app.playersContainer).toBeVisible()
    })
})
