import { test, expect } from '@playwright/test'
import type { ElectronApplication } from '@playwright/test'

import { App, COH2_EMPTY_LOG_PATH } from './pom/App.pom'
import { launchApp, closeApp } from './setup'

let electronApp: ElectronApplication
let app: App
let tempUserDataDir: string

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
    const result = await launchApp()
    electronApp = result.electronApp
    app = result.app
    tempUserDataDir = result.tempUserDataDir
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('settings preview shows sample players when the game has no players', async () => {
    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH2_EMPTY_LOG_PATH)
    await app.logLocationButtonCoh2.click()
    await app.radioHtml.click()
    await app.radioHorizontal.click()

    await expect(app.overlayPreviewSample).toBeVisible()
    await expect(app.overlayPreviewNames).toHaveCount(8)
    await expect(app.overlayPreviewNames.first()).toHaveText('Player 1')
})

test('country checkbox hides and shows the countries in the preview', async () => {
    await expect(app.overlayCountryCheckbox).toBeChecked()
    await expect(app.overlayPreviewCountries).toHaveCount(8)

    await app.overlayCountryCheckbox.click()
    await expect(app.overlayCountryCheckbox).not.toBeChecked()
    await expect(app.overlayPreviewCountries).toHaveCount(0)
    await expect(app.overlayPreviewNames).toHaveCount(8)

    await app.overlayCountryCheckbox.click()
    await expect(app.overlayPreviewCountries).toHaveCount(8)
})
