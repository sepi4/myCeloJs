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

const navbarBottom = async () => (await app.navbar.boundingBox())!.height

test('player card shows a sticky name bar once the name scrolls away', async () => {
    const stickyName = page.getByTestId('player-card-sticky-name')

    // The game history gives the card enough height to scroll
    await app.userIcon.click()
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await app.gameHistoryToggle.click()
    await app.gameHistoryPeriodAll.click()
    await expect(app.gameHistoryRows.first()).toBeVisible()
    await expect(stickyName).toBeHidden()

    // Scrolling down hides the card's own name and shows the bar with the same name
    await app.gameHistoryRows.last().scrollIntoViewIfNeeded()
    await expect(stickyName).toBeVisible()
    await expect(stickyName).toHaveText((await app.playerCardName.textContent()) ?? '')
    const barTop = (await stickyName.boundingBox())!.y
    expect(barTop).toBeCloseTo(await navbarBottom(), 0)

    // Back at the top the bar goes away
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(stickyName).toBeHidden()

    await page.keyboard.press('Escape')
    await expect(app.playersContainer).toBeVisible()
})

test('an open player row stays under the navbar while its info scrolls', async () => {
    const row = app.playerRows.filter({ has: page.getByTestId('player-toggle') }).first()
    const section = row.locator('..')

    // Open the player and their game history so the section is taller than the window
    await row.getByTestId('player-rank').click()
    await section.getByTestId('game-history-toggle').click()
    await section.getByTestId('game-history-period-all').click()
    await expect(section.getByTestId('game-history-row').first()).toBeVisible()

    // Scroll into the middle of the section, past the row's own place
    const rowBox = (await row.boundingBox())!
    const navbar = await navbarBottom()
    await page.evaluate((dy) => window.scrollBy(0, dy), rowBox.y - navbar + 300)

    // The row sits right under the navbar while the section's top has scrolled above it
    await expect.poll(async () => (await row.boundingBox())!.y).toBeCloseTo(navbar, 0)
    expect((await section.boundingBox())!.y).toBeLessThan(navbar)

    await page.evaluate(() => window.scrollTo(0, 0))
    await row.getByTestId('player-rank').click()
})
