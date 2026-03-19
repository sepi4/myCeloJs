import { test, expect, chromium } from '@playwright/test'
import type { ElectronApplication, Page, Browser } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { App, COH2_LOG_PATH } from './pom/App.pom'
import { launchApp, closeApp } from './setup'

let electronApp: ElectronApplication
let page: Page
let app: App
let tempUserDataDir: string
let overlayUrl: string
let overlayPage: Page
let browser: Browser

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
    const result = await launchApp()
    electronApp = result.electronApp
    page = result.page
    app = result.app
    tempUserDataDir = result.tempUserDataDir

    // Setup: set COH2 log so rankings get written
    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH2_LOG_PATH)
    await app.logLocationButtonCoh2.click()

    // Select HTML format and orientation so the overlay URL becomes available
    await app.radioHtml.click()
    await app.radioHorizontal.click()

    // Copy the overlay URL from the settings view
    await app.copyRankingsButton.click()
    await app.copyRankingsNotification.waitFor({ state: 'visible' })
    overlayUrl = await page.evaluate(() => navigator.clipboard.readText())

    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()

    // Open overlay in a standalone browser (simulates OBS browser source)
    browser = await chromium.launch()
    overlayPage = await browser.newPage()
    await overlayPage.goto(overlayUrl)
    await overlayPage.getByTestId('player').first().waitFor({ timeout: 5000 })
})

test.afterAll(async () => {
    await browser?.close()
    await closeApp(electronApp, tempUserDataDir)
})

function expectedPlayers() {
    const jsonFile = path.join(tempUserDataDir, 'localhostFiles', 'rankings.json')
    const rankings = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'))
    return [...rankings.teams.team1, ...rankings.teams.team2]
}

test('renders two teams', async () => {
    await expect(overlayPage.getByTestId('team')).toHaveCount(2)
})

test('renders all player names', async () => {
    for (const player of expectedPlayers()) {
        await expect(overlayPage.getByTestId('name').filter({ hasText: player.name })).toBeVisible()
    }
})

test('renders a faction image for each player', async () => {
    const factionImages = overlayPage.getByTestId('faction').locator('img')
    await expect(factionImages).toHaveCount(expectedPlayers().length)
})

test('renders a country flag for each player that has one', async () => {
    const playersWithCountry = expectedPlayers().filter((p: { country?: string }) => p.country)
    const countryImages = overlayPage.getByTestId('country').locator('img')
    await expect(countryImages).toHaveCount(playersWithCountry.length)
})

test('all images loaded successfully', async () => {
    const images = overlayPage.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
        const img = images.nth(i)
        const src = await img.getAttribute('src')
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
        expect(naturalWidth, `image failed to load: ${src}`).toBeGreaterThan(0)
    }
})

test('txt format renders a line per player', async () => {
    // Switch to txt format via the Electron app settings
    await app.settingsIcon.click()
    await app.radioTxt.click()
    await app.closeButton.click()

    // Wait for SSE to push the txt content
    await overlayPage.locator('pre').waitFor({ timeout: 10000 })

    const html = await overlayPage.locator('pre').innerHTML()
    const lines = html.split('<br>').filter((line) => line.trim() !== '')
    const playersPerTeam = expectedPlayers().length / 2
    expect(lines).toHaveLength(playersPerTeam)
})
