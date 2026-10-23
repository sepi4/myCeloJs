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

    // Left arrow goes back and right arrow forward
    await page.keyboard.press('ArrowLeft')
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await page.keyboard.press('ArrowRight')
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

    // Escape still closes the whole card, even with history.
    // My card kept its open game, so the other player can be opened right away.
    await expect(app.gameDetails).toBeVisible()
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

test('keeps the game history of a card when moving back and forward', async () => {
    const historyRequests: string[] = []
    page.on('request', (r) => {
        if (r.url().includes('getRecentMatchHistoryByProfileId')) {
            historyRequests.push(r.url())
        }
    })

    // Open my card, its game history and the last game in the list
    await app.userIcon.click()
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    const myName = (await app.playerCardName.textContent()) ?? ''
    await app.historyToggle.click()
    await expect(app.gameHistoryItems.first()).toBeVisible()
    await app.historyPeriodAll.click()
    await app.gameHistoryItems.last().click()
    await expect(app.gameDetails).toBeVisible()
    expect(historyRequests).toHaveLength(1)

    // Open another player from the game, the page scrolls to the top
    const otherPlayer = app.gameDetailsPlayers.filter({ hasNotText: myName }).first()
    await otherPlayer.scrollIntoViewIfNeeded()
    const scrollBefore = await page.evaluate(() => window.scrollY)
    expect(scrollBefore).toBeGreaterThan(0)
    await otherPlayer.click()
    await expect(app.steamIdValue).not.toHaveText(STEAM_ID)
    await expect(app.gameHistory).not.toBeVisible()
    expect(await page.evaluate(() => window.scrollY)).toBe(0)

    // Back restores the open history, the open game and the scroll position
    await app.backButton.click()
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await expect(app.gameHistory).toBeVisible()
    await expect(app.gameDetails).toBeVisible()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollBefore)
    expect(historyRequests).toHaveLength(1)

    // Forward shows the other player with a closed history
    await app.forwardButton.click()
    await expect(app.steamIdValue).not.toHaveText(STEAM_ID)
    await expect(app.gameHistory).not.toBeVisible()

    // Opening the other player's history fetches it once, going back and forward keeps it
    await app.historyToggle.click()
    await expect(app.gameHistoryItems.first()).toBeVisible()
    expect(historyRequests).toHaveLength(2)
    await app.backButton.click()
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await app.forwardButton.click()
    await expect(app.gameHistory).toBeVisible()
    expect(historyRequests).toHaveLength(2)

    await page.keyboard.press('Escape')
})
