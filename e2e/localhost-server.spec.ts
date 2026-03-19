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
let overlayPort: string

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
    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()

    // Read the overlay port
    const portFile = path.join(tempUserDataDir, 'localhostFiles', 'port.js')
    const portContent = fs.readFileSync(portFile, 'utf-8')
    overlayPort = portContent.match(/\d+/)![0]
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('overlay page renders player names and faction images', async () => {
    const browser: Browser = await chromium.launch()
    const overlayPage = await browser.newPage()

    try {
        // Collect failed image requests
        const failedRequests: string[] = []
        overlayPage.on('response', (response) => {
            if (response.url().endsWith('.png') && response.status() !== 200) {
                failedRequests.push(`${response.status()} ${response.url()}`)
            }
        })

        await overlayPage.goto(`http://localhost:${overlayPort}`)

        // Wait for SSE to push content into the body
        await overlayPage.waitForSelector('.playerStyle', { timeout: 5000 })

        // Verify players from both teams are rendered
        const jsonFile = path.join(tempUserDataDir, 'localhostFiles', 'rankings.json')
        const rankings = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'))
        const allPlayers = [...rankings.teams.team1, ...rankings.teams.team2]

        for (const player of allPlayers) {
            await expect(overlayPage.locator('.nameStyle', { hasText: player.name })).toBeVisible()
        }

        // Verify faction images are present and loaded
        const factionImages = overlayPage.locator('.factionStyle img')
        await expect(factionImages).toHaveCount(allPlayers.length)

        // Verify country flag images are present and loaded
        const playersWithCountry = allPlayers.filter((p: { country?: string }) => p.country)
        const countryImages = overlayPage.locator('.countryStyle img')
        await expect(countryImages).toHaveCount(playersWithCountry.length)

        // Verify all images actually loaded (naturalWidth > 0 means loaded successfully)
        const allImages = overlayPage.locator('img')
        const count = await allImages.count()
        for (let i = 0; i < count; i++) {
            const naturalWidth = await allImages
                .nth(i)
                .evaluate((img: HTMLImageElement) => img.naturalWidth)
            const src = await allImages.nth(i).getAttribute('src')
            expect(naturalWidth, `image failed to load: ${src}`).toBeGreaterThan(0)
        }

        // Verify no image requests returned errors
        expect(failedRequests, `image requests failed:\n${failedRequests.join('\n')}`).toHaveLength(
            0
        )

        // Verify team structure — two team divs
        const teamDivs = overlayPage.locator('[class^="teamStyle"]')
        await expect(teamDivs).toHaveCount(2)
    } finally {
        await browser.close()
    }
})
