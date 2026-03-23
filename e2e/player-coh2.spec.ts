import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import { App, COH2_LOG_PATH, STEAM_ID } from './pom/App.pom'
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

    // Setup: set COH2 log so players are loaded
    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH2_LOG_PATH)
    await app.logLocationButtonCoh2.click()
    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('ELO checkbox is not visible in COH2 mode', async () => {
    await expect(app.checkboxElo).not.toBeVisible()
})

test('steam id validation and player card', async () => {
    // Open settings and enter an invalid steam ID
    await app.settingsIcon.click()
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
    await app.closeButton.click()
})

test('navbar checkboxes - table, total and all ', async () => {
    await app.userIcon.click()
    await expect(app.steamIdValue).toBeVisible()

    // Table toggle
    await app.checkboxTable.click()
    await expect(app.tableView).toBeVisible()
    await app.checkboxTable.click()
    await expect(app.tableView).not.toBeVisible()

    // Total toggle
    await app.checkboxTotal.click()
    await expect(app.totalGames).toBeVisible()
    await app.checkboxTotal.click()
    await expect(app.totalGames).not.toBeVisible()

    // All toggle — unranked rows are added when on, removed when off
    const rowCountBefore = await app.rankRows.count()
    await app.checkboxAll.click()
    await expect(app.rankRows).not.toHaveCount(rowCountBefore)
    await app.checkboxAll.click()
    await expect(app.rankRows).toHaveCount(rowCountBefore)
    await app.closeButton.click()
})

test('player card external links have correct URLs', async () => {
    // Open my player card
    await app.userIcon.click()
    await expect(app.steamIdValue).toBeVisible()

    // Verify each link icon exists and points to the correct URL
    await expect(app.linkCoh2stats).toHaveAttribute(
        'data-url',
        `https://coh2stats.com/players/${STEAM_ID}`
    )
    await expect(app.linkCoh2).toHaveAttribute(
        'data-url',
        `https://www.coh2.org/ladders/playercard/steamid/${STEAM_ID}`
    )
    await expect(app.linkSteam).toHaveAttribute(
        'data-url',
        `https://steamcommunity.com/profiles/${STEAM_ID}`
    )
    await app.closeButton.click()
})
