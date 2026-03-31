import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import { App, COH2_AI_LOG_PATH, COH3_AI_LOG_PATH } from './pom/App.pom'
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

test('COH2 game vs AI shows both human and AI players', async () => {
    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH2_AI_LOG_PATH)
    await app.logLocationButtonCoh2.click()
    await app.closeButton.click()

    await expect(app.playersContainer).toBeVisible()
    await expect(app.teamContainers).toHaveCount(2)
    await expect(app.page.getByText('sepi | ПУТИНА В МОГИЛУ')).toBeVisible()
    await expect(app.page.getByText('CPU - Easy')).toBeVisible()
})

test('COH3 game vs AI shows both human and AI players', async () => {
    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH3_AI_LOG_PATH)
    await app.logLocationButtonCoh3.click()
    await app.closeButton.click()

    // Switch to COH3
    await app.radioCoh3.click()

    await expect(app.playersContainer).toBeVisible()
    await expect(app.teamContainers).toHaveCount(2)
    await expect(app.page.getByText('sepi | ПУТИНА В МОГИЛУ')).toBeVisible()
    await expect(app.page.getByText('CPU - Expert')).toBeVisible()
})
