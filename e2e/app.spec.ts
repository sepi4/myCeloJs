import { test, expect, _electron as electron } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { AppPage, LOG_PATH, STEAM_ID } from './pages/AppPage'

let electronApp: ElectronApplication
let page: Page
let app: AppPage
let tempUserDataDir: string

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
    tempUserDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mycelo-e2e-'))

    electronApp = await electron.launch({
        args: [
            path.join(__dirname, '../out/main/index.js'),
            `--user-data-dir=${tempUserDataDir}`,
        ],
    })
    page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    app = new AppPage(page)
})

test.afterAll(async () => {
    await electronApp.close()
    fs.rmSync(tempUserDataDir, { recursive: true, force: true })
})

test('set warning.log location and verify players appear on main view', async () => {
    // Fresh start — no settings, prompt should be visible
    await expect(app.noLogPrompt).toBeVisible()

    // Open settings and mock the native file dialog
    await app.settingsIcon.click()
    await expect(app.languageSelect).toBeVisible()
    await app.mockFileDialog(electronApp, LOG_PATH)

    // Select the log file and return to main view
    await app.logLocationButton.click()
    await app.closeButton.click()

    // Players container
    await expect(app.playersContainer).toBeVisible()
})

test('switch language to Russian and back to English', async () => {
    // Open settings and switch to Russian
    await app.settingsIcon.click()
    await expect(app.languageSelect).toBeVisible()
    await app.languageSelect.selectOption('ru')

    // Verify Russian label is shown in settings
    await expect(app.languageTitle).toHaveText('Язык')

    // Close settings and verify Russian text on main view
    await app.closeButton.click()
    await expect(app.autoLabel).toHaveText('авто')

    // Open settings again and switch back to English
    await app.settingsIcon.click()
    await app.languageSelect.selectOption('en')
    await expect(app.languageTitle).toHaveText('Language')
})

test('steam id validation and player card', async () => {
    // Still in settings from the previous test — enter an invalid steam ID
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

test('OBS studio settings - format, orientation and copy buttons', async () => {
    // open settings
    await app.settingsIcon.click()
    await expect(app.languageSelect).toBeVisible()

    // Copy sections should not be visible before selecting format and orientation
    await expect(app.copyRankings).not.toBeVisible()
    await expect(app.copySettings).not.toBeVisible()

    // Select HTML format and horizontal orientation
    await app.radioHtml.click()
    await app.radioHorizontal.click()

    // Both copy sections should now appear
    await expect(app.copyRankings).toBeVisible()
    await expect(app.copySettings).toBeVisible()

    // Copy the rankings file path — notification should appear
    await app.copyRankingsButton.click()
    await expect(app.copyRankingsNotification).toBeVisible()

    // Copy the settings file path — notification should appear
    await app.copySettingsButton.click()
    await expect(app.copySettingsNotification).toBeVisible()
    await app.closeButton.click()
})

test('player card external links have correct URLs', async () => {
    // Open my player card
    await app.userIcon.click()
    await expect(app.steamIdValue).toBeVisible()

    // Verify each link icon exists and points to the correct URL
    await expect(app.linkCoh2stats).toHaveAttribute('data-url', `https://coh2stats.com/players/${STEAM_ID}`)
    await expect(app.linkCoh2).toHaveAttribute('data-url', `https://www.coh2.org/ladders/playercard/steamid/${STEAM_ID}`)
    await expect(app.linkSteam).toHaveAttribute('data-url', `https://steamcommunity.com/profiles/${STEAM_ID}`)
    await app.closeButton.click()
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
