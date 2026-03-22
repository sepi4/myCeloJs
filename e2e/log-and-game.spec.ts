import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import { App, COH2_LOG_PATH, COH2_LOG_PATH_2, COH3_LOG_PATH } from './pom/App.pom'
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
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('set warning.log location and verify players appear on main view', async () => {
    // Fresh start — no settings, prompt should be visible
    await expect(app.noLogPrompt).toBeVisible()

    // Open settings and mock the native file dialog
    await app.settingsIcon.click()
    await expect(app.languageSelectEn).toBeVisible()
    await app.mockFileDialog(electronApp, COH2_LOG_PATH)

    // Select the log file and return to main view
    await app.logLocationButtonCoh2.click()
    await app.closeButton.click()

    // Players from the example log should be visible with 2 teams
    await expect(app.playersContainer).toBeVisible()
    await expect(app.teamContainers).toHaveCount(2)
    await expect(app.page.getByText('Polmuadiv')).toBeVisible()
})

test('set COH3 log and toggle between games', async () => {
    // Only COH2 log is set — COH3 radio should be disabled
    await expect(app.radioCoh2).toBeEnabled()
    await expect(app.radioCoh3).toBeDisabled()

    // Set COH3 log via settings
    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH3_LOG_PATH)
    await app.logLocationButtonCoh3.click()
    await app.closeButton.click()

    // Both radios should now be enabled
    await expect(app.radioCoh2).toBeEnabled()
    await expect(app.radioCoh3).toBeEnabled()

    // Switch to COH3 — COH3 players should appear
    await app.radioCoh3.click()
    await expect(app.playersContainer).toBeVisible()
    await expect(app.teamContainers).toHaveCount(2)
    await expect(app.page.getByText('Alhas')).toBeVisible()
    await expect(app.page.getByText('Polmuadiv')).not.toBeVisible()

    // Switch back to COH2 — COH2 players should reappear
    await app.radioCoh2.click()
    await expect(app.page.getByText('Polmuadiv')).toBeVisible()
    await expect(app.page.getByText('Alhas')).not.toBeVisible()
})

test('remove COH3 log disables its radio and keeps COH2 active', async () => {
    // Both logs are set at this point — remove COH3 log
    await app.settingsIcon.click()
    await app.clearLogCoh3Button.click()
    await app.closeButton.click()

    // COH3 radio should be disabled, COH2 should remain enabled
    await expect(app.radioCoh3).toBeDisabled()
    await expect(app.radioCoh2).toBeEnabled()

    // COH2 players should still be visible
    await expect(app.playersContainer).toBeVisible()
    await expect(app.page.getByText('Polmuadiv')).toBeVisible()
})

test('auto checkbox toggles interval input and alert visibility', async () => {
    // Auto is enabled by default — interval input and alert should be visible
    await expect(app.autoLabel).toBeVisible()
    await expect(app.intervalInput).toBeVisible()
    await expect(app.alertLabel).toBeVisible()

    // Disable auto — interval and alert should disappear
    await app.autoLabel.click()
    await expect(app.intervalInput).not.toBeVisible()
    await expect(app.alertLabel).not.toBeVisible()

    // Check log button should still be visible
    await expect(app.checkLogButton).toBeVisible()

    // Re-enable auto — interval and alert should reappear
    await app.autoLabel.click()
    await expect(app.intervalInput).toBeVisible()
    await expect(app.alertLabel).toBeVisible()
})

test('check log button loads players from a different log file', async () => {
    // Switch log location to the second log file via settings
    await app.settingsIcon.click()
    await expect(app.languageSelectEn).toBeVisible()
    await app.mockFileDialog(electronApp, COH2_LOG_PATH_2)
    await app.logLocationButtonCoh2.click()
    await app.closeButton.click()

    // The second log has different players — verify they appear
    await expect(app.playersContainer).toBeVisible()
    await expect(app.teamContainers).toHaveCount(2)
    await expect(app.page.getByText('TestPlayerA')).toBeVisible()
    await expect(app.page.getByText('Polmuadiv')).not.toBeVisible()

    // Switch back to original log file and use "check log" button
    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH2_LOG_PATH)
    await app.logLocationButtonCoh2.click()
    await app.closeButton.click()

    // Click check log to re-read the original file
    await app.checkLogButton.click()
    await expect(app.page.getByText('Polmuadiv')).toBeVisible()
    await expect(app.page.getByText('TestPlayerA')).not.toBeVisible()
})
