import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { App, COH2_LOG_PATH, COH2_LOG_PATH_2 } from './pom/App.pom'
import { launchApp, closeApp } from './setup'

let electronApp: ElectronApplication
let page: Page
let app: App
let tempUserDataDir: string
let tempLogFile: string

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
    const result = await launchApp()
    electronApp = result.electronApp
    page = result.page
    app = result.app
    tempUserDataDir = result.tempUserDataDir

    // Create a temporary log file starting with the first log's content
    tempLogFile = path.join(tempUserDataDir, 'warnings.log')
    fs.copyFileSync(COH2_LOG_PATH, tempLogFile)

    // Set the temp log file as COH2 log location
    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, tempLogFile)
    await app.logLocationButtonCoh2.click()
    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()
    await expect(app.page.getByText('Polmuadiv')).toBeVisible()

    // Set interval to 1 second (minimum)
    await app.intervalInput.fill('1')
    await app.intervalInput.press('Enter')
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('auto-polling detects log file change', async () => {
    // Verify initial players are from the first log
    await expect(app.page.getByText('Polmuadiv')).toBeVisible()
    await expect(app.page.getByText('TestPlayerA')).not.toBeVisible()

    // Overwrite the log file with different content
    fs.copyFileSync(COH2_LOG_PATH_2, tempLogFile)

    // The app should pick up the new players within a few seconds
    await expect(app.page.getByText('TestPlayerA')).toBeVisible({ timeout: 10000 })
    await expect(app.page.getByText('Polmuadiv')).not.toBeVisible()
})

test('auto-polling detects log file changing back', async () => {
    // Overwrite back to the original log
    fs.copyFileSync(COH2_LOG_PATH, tempLogFile)

    // The app should pick up the original players again
    await expect(app.page.getByText('Polmuadiv')).toBeVisible({ timeout: 10000 })
    await expect(app.page.getByText('TestPlayerA')).not.toBeVisible()
})
