import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import { App, COH3_LOG_PATH, STEAM_ID } from './pom/App.pom'
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

    // Setup: set only COH3 log (auto-selects COH3 game)
    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH3_LOG_PATH)
    await app.logLocationButtonCoh3.click()
    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('ELO checkbox toggles rating visibility in player rows', async () => {
    await expect(app.checkboxElo).toBeVisible()

    // Before toggling: no ELO ratings shown in player rank spans
    const rankTexts = app.playerRanks
    const firstRankBefore = await rankTexts.first().textContent()
    expect(firstRankBefore).not.toMatch(/\(\d+\)/)

    // Enable ELO
    await app.checkboxElo.click()

    // After toggling: ELO ratings should appear as (number) in at least one rank
    await expect(rankTexts.first()).toContainText(/\(\d+\)/)

    // Disable ELO
    await app.checkboxElo.click()

    // After toggling off: no ELO ratings shown
    await expect(rankTexts.first()).not.toContainText(/\(\d+\)/)
})

test('search by steam ID and open COH3 player card', async () => {
    // Open search view
    await app.searchIcon.click()
    await expect(app.searchInput).toBeVisible()

    // Search by steam ID — triggers COH3 API calls
    await app.searchInput.fill(STEAM_ID)
    await app.searchInput.press('Enter')

    // At least one player result should appear
    await expect(app.foundPlayers.first()).toBeVisible()

    // Open the first player's card
    await app.foundPlayers.first().click()
    await expect(app.steamIdValue).toBeVisible()
    await app.closeButton.click()
})

test('COH3 player card has correct external links', async () => {
    // Open search and find the player again
    await app.searchIcon.click()
    await app.searchInput.fill(STEAM_ID)
    await app.searchInput.press('Enter')
    await expect(app.foundPlayers.first()).toBeVisible()

    // Open the player card
    await app.foundPlayers.first().click()
    await expect(app.steamIdValue).toBeVisible()

    const steamId = await app.steamIdValue.textContent()
    const profileId = await app.page
        .getByText('profile id:')
        .locator('..')
        .locator('td')
        .textContent()

    // COH3 links: coh3stats (uses profileId) and steam (uses steamId)
    await expect(app.linkCoh3stats).toHaveAttribute(
        'data-url',
        `https://coh3stats.com/players/${profileId}`
    )
    await expect(app.linkSteam).toHaveAttribute(
        'data-url',
        `https://steamcommunity.com/profiles/${steamId}`
    )

    // COH2-specific links should NOT be present
    await expect(app.linkCoh2stats).not.toBeVisible()
    await expect(app.linkCoh2).not.toBeVisible()

    await app.closeButton.click()
})
