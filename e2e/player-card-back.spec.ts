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

    // Setup: set COH2 log and steam ID so my player card is available
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

test('moves back and forward between player cards', async () => {
    // Open my player card and the details of the first game
    await app.userIcon.click()
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await expect(app.backButton).not.toBeVisible()
    const myName = (await app.playerCardName.textContent()) ?? ''

    await app.historyToggle.click()
    await app.gameHistoryItems.first().click()
    await expect(app.gameDetails).toBeVisible()

    // Opens another player's card from the game details
    const openOtherPlayer = async () => {
        await app.gameDetailsPlayers.filter({ hasNotText: myName }).first().click()
        await expect(app.steamIdValue).not.toHaveText(STEAM_ID)
        await expect(app.backButton).toBeVisible()
    }

    // Back button returns to my card and hides itself
    await openOtherPlayer()
    await expect(app.forwardButton).not.toBeVisible()
    await app.backButton.click()
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await expect(app.backButton).not.toBeVisible()

    // Forward button goes to the other player again
    await expect(app.forwardButton).toBeVisible()
    await app.forwardButton.click()
    await expect(app.steamIdValue).not.toHaveText(STEAM_ID)
    await expect(app.forwardButton).not.toBeVisible()
    await expect(app.backButton).toBeVisible()

    // Backspace goes back and Shift+Backspace forward
    await page.keyboard.press('Backspace')
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await page.keyboard.press('Shift+Backspace')
    await expect(app.steamIdValue).not.toHaveText(STEAM_ID)

    // The mouse side buttons do the same
    const mouseUp = (button: number) =>
        page.evaluate((b) => window.dispatchEvent(new MouseEvent('mouseup', { button: b })), button)
    await mouseUp(3)
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await mouseUp(4)
    await expect(app.steamIdValue).not.toHaveText(STEAM_ID)
    await mouseUp(3)
    await expect(app.steamIdValue).toHaveText(STEAM_ID)

    // Escape still closes the whole card, even with history
    await app.historyToggle.click()
    await app.gameHistoryItems.first().click()
    await openOtherPlayer()
    await page.keyboard.press('Escape')
    await expect(app.steamIdValue).not.toBeVisible()
    await expect(app.playersContainer).toBeVisible()

    // Opening a card again starts a new history
    await app.userIcon.click()
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await expect(app.backButton).not.toBeVisible()
    await expect(app.forwardButton).not.toBeVisible()
})
