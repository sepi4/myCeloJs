import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import { App, COH2_LOG_PATH, COH3_LOG_PATH, STEAM_ID } from './pom/App.pom'
import { launchApp, closeApp } from './setup'

let electronApp: ElectronApplication
let page: Page
let app: App
let tempUserDataDir: string

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
    const result = await launchApp()
    electronApp = result.electronApp
    page = result.page
    app = result.app
    tempUserDataDir = result.tempUserDataDir

    // Setup: set both COH2 and COH3 logs so the COH2/COH3 radios are both enabled
    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH2_LOG_PATH)
    await app.logLocationButtonCoh2.click()
    await app.mockFileDialog(electronApp, COH3_LOG_PATH)
    await app.logLocationButtonCoh3.click()
    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

// Faction icons rendered by FactionIcon.tsx carry a `title` attr with the
// faction code, which differs between games.
const COH2_FACTION_TITLES = ['sov', 'wer', 'usa', 'okw', 'uk']
const COH3_FACTION_TITLES = ['dak', 'wer', 'usa', 'uk']

test('toggles between COH2 and COH3 profile views inside player card', async () => {
    // Enable table mode so faction icons are rendered
    await app.checkboxTable.click()

    // Start in COH3 mode and open the known player's card via search
    await app.radioCoh3.click()
    await app.searchIcon.click()
    await app.searchInput.fill(STEAM_ID)
    await app.searchInput.press('Enter')
    await expect(app.foundPlayers.first()).toBeVisible()
    await app.foundPlayers.first().click()

    // Player card opens in COH3 view: coh3 radio checked, coh3stats link visible
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await expect(app.playerCardRadioCoh3).toBeChecked()
    await expect(app.playerCardRadioCoh2).not.toBeChecked()
    await expect(app.linkCoh3stats).toBeVisible()
    await expect(app.linkCoh2stats).not.toBeVisible()
    await expect(app.linkCoh2).not.toBeVisible()

    // Table shows COH3 faction icons
    await expect(app.tableView).toBeVisible()
    const coh3Icons = app.tableView.locator('img')
    await expect(coh3Icons).toHaveCount(COH3_FACTION_TITLES.length)
    for (let i = 0; i < COH3_FACTION_TITLES.length; i++) {
        await expect(coh3Icons.nth(i)).toHaveAttribute('title', COH3_FACTION_TITLES[i])
    }

    // Other-game lookup runs async; radio stays disabled until it completes
    await expect(app.playerCardRadioCoh2).toBeEnabled()

    // Switch to COH2 view — coh2-specific links appear, coh3 link disappears
    await app.playerCardRadioCoh2.click()
    await expect(app.playerCardRadioCoh2).toBeChecked()
    await expect(app.playerCardRadioCoh3).not.toBeChecked()
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await expect(app.linkCoh2stats).toBeVisible()
    await expect(app.linkCoh2).toBeVisible()
    await expect(app.linkCoh3stats).not.toBeVisible()
    await expect(app.linkCoh2stats).toHaveAttribute(
        'data-url',
        `https://coh2stats.com/players/${STEAM_ID}`
    )

    // Table now shows COH2 faction icons (5 factions vs 4 in COH3)
    const coh2Icons = app.tableView.locator('img')
    await expect(coh2Icons).toHaveCount(COH2_FACTION_TITLES.length)
    for (let i = 0; i < COH2_FACTION_TITLES.length; i++) {
        await expect(coh2Icons.nth(i)).toHaveAttribute('title', COH2_FACTION_TITLES[i])
    }

    // Switch back to COH3 — coh3stats link reappears, icons switch back
    await app.playerCardRadioCoh3.click()
    await expect(app.playerCardRadioCoh3).toBeChecked()
    await expect(app.steamIdValue).toHaveText(STEAM_ID)
    await expect(app.linkCoh3stats).toBeVisible()
    await expect(app.linkCoh2stats).not.toBeVisible()
    await expect(app.linkCoh2).not.toBeVisible()
    await expect(app.tableView.locator('img')).toHaveCount(COH3_FACTION_TITLES.length)

    await app.closeButton.click()
})
