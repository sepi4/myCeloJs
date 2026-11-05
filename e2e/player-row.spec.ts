import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import { App, COH2_LOG_PATH } from './pom/App.pom'
import { launchApp, closeApp } from './setup'

let electronApp: ElectronApplication
let page: Page
let app: App
let tempUserDataDir: string

test.beforeAll(async () => {
    const result = await launchApp()
    electronApp = result.electronApp
    page = result.page
    app = result.app
    tempUserDataDir = result.tempUserDataDir

    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH2_LOG_PATH)
    await app.logLocationButtonCoh2.click()
    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('row click toggles the extra info, name click opens the player card', async () => {
    const row = app.playerRows.filter({ has: page.getByTestId('player-toggle') }).first()
    const extraInfo = row.locator('..').getByTestId('player-extra-info')
    await expect(extraInfo).toHaveCount(0)

    // anywhere on the row outside the name, not only the arrow
    await row.getByTestId('player-rank').click()
    await expect(extraInfo).toBeVisible()
    await row.getByTestId('player-rank').click()
    await expect(extraInfo).toHaveCount(0)

    await row.getByTestId('player-name').click()
    await expect(app.playerCardName).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(app.playersContainer).toBeVisible()
    await expect(extraInfo).toHaveCount(0)
})
