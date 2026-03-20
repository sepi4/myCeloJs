import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import { App, COH2_LOG_PATH } from './pom/App.pom'
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

test('team toggle expands and collapses all players in a team', async () => {
    // Ensure we are on the main view with players loaded
    await expect(app.teamContainers).toHaveCount(2)

    // No player extra info should be visible initially
    await expect(app.playerExtraInfos).toHaveCount(0)

    // Click the first team's toggle — should expand all players in that team
    await app.teamToggles.first().click()
    await expect(app.playerExtraInfos.first()).toBeVisible()
    const expandedCount = await app.playerExtraInfos.count()
    expect(expandedCount).toBeGreaterThan(0)

    // Click the same toggle again — should collapse all players
    await app.teamToggles.first().click()
    await expect(app.playerExtraInfos).toHaveCount(0)
})

test('navbar position changes navbar layout', async () => {
    // Open settings
    await app.settingsIcon.click()
    await expect(app.navbarPositionTop).toBeChecked()
    await app.closeButton.click()

    // Default 'top' — navbar should be above the main content
    const navTop = await app.navbar.boundingBox()
    const mainTop = await app.playersContainer.boundingBox()
    expect(navTop!.y).toBeLessThan(mainTop!.y)

    // Switch to right — navbar should be to the right of the main content
    await app.settingsIcon.click()
    await app.navbarPositionRight.click()
    await app.closeButton.click()
    const navRight = await app.navbar.boundingBox()
    const mainRight = await app.playersContainer.boundingBox()
    expect(navRight!.x).toBeGreaterThan(mainRight!.x)

    // Switch to left — navbar should be to the left of the main content
    await app.settingsIcon.click()
    await app.navbarPositionLeft.click()
    await app.closeButton.click()
    const navLeft = await app.navbar.boundingBox()
    const mainLeft = await app.playersContainer.boundingBox()
    expect(navLeft!.x).toBeLessThan(mainLeft!.x)
})
