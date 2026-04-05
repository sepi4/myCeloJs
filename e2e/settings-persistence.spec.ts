import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import { App, COH2_LOG_PATH, COH3_LOG_PATH, STEAM_ID } from './pom/App.pom'
import { launchApp, relaunchApp, closeApp } from './setup'

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
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('set all settings to non-default values', async () => {
    // Open settings
    await app.settingsIcon.click()

    // Language: en → ru
    await app.languageSelectRu.click()
    await expect(app.languageTitle).toHaveText('Язык')

    // Navbar position: top → right
    await app.navbarPositionRight.click()

    // Font size: small → large
    await app.fontSizeLarge.click()

    // Theme: default → nord
    await app.themeSelect.selectOption('nord')

    // Log locations
    await app.mockFileDialog(electronApp, COH2_LOG_PATH)
    await app.logLocationButtonCoh2.click()
    await app.mockFileDialog(electronApp, COH3_LOG_PATH)
    await app.logLocationButtonCoh3.click()

    // Steam ID
    await app.steamIdInput.fill(STEAM_ID)
    await app.steamIdSave.click()
    await expect(app.steamIdSuccess).toBeVisible()

    // OBS: html format + horizontal orientation
    await app.radioHtml.click()
    await app.radioHorizontal.click()

    // Interval: 3 → 7
    await app.intervalInput.fill('7')

    // Close settings
    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()

    // Alert: off → on
    await app.alertLabel.click()

    // Navbar checkboxes: all off → on
    await app.checkboxAll.click()
    await app.checkboxTotal.click()
    await app.checkboxTable.click()

    // Switch to COH3
    await app.radioCoh3.click()
    await expect(app.page.getByText('Alhas')).toBeVisible()
})

test('settings persist after restart', async () => {
    // Restart the app with the same user data directory
    const result = await relaunchApp(electronApp, tempUserDataDir)
    electronApp = result.electronApp
    page = result.page
    app = result.app

    // --- Main view checks ---

    // Players should load immediately (log locations persisted)
    await expect(app.playersContainer).toBeVisible()

    // COH3 should be the active game
    await expect(app.page.getByText('Alhas')).toBeVisible()

    // Navbar should be on the right side of the main content
    const navBox = await app.navbar.boundingBox()
    const mainBox = await app.playersContainer.boundingBox()
    expect(navBox!.x).toBeGreaterThan(mainBox!.x)

    // Alert checkbox should be checked
    const alertCheckbox = app.alertLabel.locator('..').locator('input')
    await expect(alertCheckbox).toBeChecked()

    // Navbar checkboxes should all be checked
    const allCheckbox = app.checkboxAll.locator('..').locator('input')
    const totalCheckbox = app.checkboxTotal.locator('..').locator('input')
    const tableCheckbox = app.checkboxTable.locator('..').locator('input')
    await expect(allCheckbox).toBeChecked()
    await expect(totalCheckbox).toBeChecked()
    await expect(tableCheckbox).toBeChecked()

    // Both COH2 and COH3 radios should be enabled (both logs set)
    await expect(app.radioCoh2).toBeEnabled()
    await expect(app.radioCoh3).toBeEnabled()

    // --- Settings page checks ---

    await app.settingsIcon.click()

    // Interval should be 7
    await expect(app.intervalInput).toHaveValue('7')

    // Language is Russian
    await expect(app.languageTitle).toHaveText('Язык')

    // Navbar position is right
    await expect(app.navbarPositionRight).toBeChecked()

    // Font size is large
    await expect(app.fontSizeLarge).toBeChecked()
    const rootFontSize = await page.evaluate(() => document.documentElement.style.fontSize)
    expect(rootFontSize).toBe('150%')

    // Theme is nord
    await expect(app.themeSelect).toHaveValue('nord')
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    expect(theme).toBe('nord')

    // Steam ID is saved
    await expect(app.steamIdInput).toHaveValue(STEAM_ID)

    // OBS: html + horizontal selected
    await expect(app.radioHtml).toBeChecked()
    await expect(app.radioHorizontal).toBeChecked()
})
