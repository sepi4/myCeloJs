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

test('switch language to Russian and back to English', async () => {
    // Open settings and switch to Russian
    await app.settingsIcon.click()
    await expect(app.languageSelectEn).toBeVisible()
    await app.languageSelectRu.click()

    // Verify Russian label is shown in settings
    await expect(app.languageTitle).toHaveText('Язык')

    // Close settings and verify Russian text on main view
    await app.closeButton.click()
    await expect(app.autoLabel).toHaveText('авто')

    // Open settings again and switch back to English
    await app.settingsIcon.click()
    await app.languageSelectEn.click()
    await expect(app.languageTitle).toHaveText('Language')
    await app.closeButton.click()
})

test('OBS studio settings - format, orientation and copy buttons', async () => {
    // open settings
    await app.settingsIcon.click()
    await expect(app.languageSelectEn).toBeVisible()

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

test('font size changes update the root font size', async () => {
    await app.settingsIcon.click()

    // Default is small (100%)
    await expect(app.fontSizeSmall).toBeChecked()
    let rootFontSize = await page.evaluate(() => document.documentElement.style.fontSize)
    expect(rootFontSize).toBe('100%')

    // Switch to medium (125%)
    await app.fontSizeMedium.click()
    rootFontSize = await page.evaluate(() => document.documentElement.style.fontSize)
    expect(rootFontSize).toBe('125%')

    // Switch to large (150%)
    await app.fontSizeLarge.click()
    rootFontSize = await page.evaluate(() => document.documentElement.style.fontSize)
    expect(rootFontSize).toBe('150%')

    // Reset back to small
    await app.fontSizeSmall.click()
    rootFontSize = await page.evaluate(() => document.documentElement.style.fontSize)
    expect(rootFontSize).toBe('100%')

    await app.closeButton.click()
})

test('reset all settings - cancel keeps settings, ok clears and reloads', async () => {
    // Open settings — log location is set so the reset button should be enabled
    await app.settingsIcon.click()
    await expect(app.resetSettingsButton).toBeEnabled()

    // Click reset — confirmation modal should appear
    await app.resetSettingsButton.click()
    await expect(app.resetConfirmOk).toBeVisible()
    await expect(app.resetConfirmCancel).toBeVisible()

    // Cancel — modal closes, settings are unchanged
    await app.resetConfirmCancel.click()
    await expect(app.resetConfirmOk).not.toBeVisible()
    await expect(app.languageSelectEn).toBeVisible()

    // Click reset again and confirm — page reloads to a fresh state
    await app.resetSettingsButton.click()
    await app.resetConfirmOk.click()
    await page.waitForLoadState('domcontentloaded')

    // After reset the no-log prompt should be visible and reset button disabled
    await expect(app.noLogPrompt).toBeVisible()
    await app.settingsIcon.click()
    await expect(app.resetSettingsButton).toBeDisabled()
    await app.closeButton.click()
})
