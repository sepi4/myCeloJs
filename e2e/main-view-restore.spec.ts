import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import { App, COH2_LOG_PATH } from './pom/App.pom'
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

    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH2_LOG_PATH)
    await app.logLocationButtonCoh2.click()
    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('closing the player card keeps the main view as it was', async () => {
    const historyRequests: string[] = []
    page.on('request', (r) => {
        if (r.url().includes('getRecentMatchHistoryByProfileId')) {
            historyRequests.push(r.url())
        }
    })

    // Open the first team, a player's game history and its last game
    const main = app.playersContainer
    await app.teamToggles.first().click()
    await expect(app.playerExtraInfos.first()).toBeVisible()
    await main.getByTestId('history-toggle').first().click()
    const games = main.getByTestId('game-history-item')
    await expect(games.first()).toBeVisible()
    await main.getByTestId('history-period-all').first().click()
    await games.last().click()
    await expect(main.getByTestId('game-details')).toBeVisible()
    expect(historyRequests).toHaveLength(1)

    // Open a player's card from the game
    const playerLink = main.getByTestId('game-details-player').first()
    await playerLink.scrollIntoViewIfNeeded()
    const scrollBefore = await page.evaluate(() => window.scrollY)
    await playerLink.click()
    await expect(app.steamIdValue).toBeVisible()
    await expect(main).not.toBeVisible()

    // Escape returns to the same main view without fetching the history again
    await page.keyboard.press('Escape')
    await expect(app.steamIdValue).not.toBeVisible()
    await expect(main).toBeVisible()
    await expect(app.playerExtraInfos.first()).toBeVisible()
    await expect(main.getByTestId('game-details')).toBeVisible()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollBefore)
    expect(historyRequests).toHaveLength(1)
})
