import fs from 'fs'
import path from 'path'

import { test, expect } from '@playwright/test'
import type { ElectronApplication } from '@playwright/test'

import { App, COH2_LOG_PATH } from './pom/App.pom'
import { launchApp, closeApp } from './setup'

let electronApp: ElectronApplication
let app: App
let tempUserDataDir: string

test.beforeAll(async () => {
    const result = await launchApp()
    electronApp = result.electronApp
    app = result.app
    tempUserDataDir = result.tempUserDataDir

    // Hangul fillers render as nothing, like the names some players pick
    const tempLogFile = path.join(tempUserDataDir, 'warnings.log')
    const log = fs.readFileSync(COH2_LOG_PATH, 'utf8')
    fs.writeFileSync(
        tempLogFile,
        log.replaceAll('Polmuadiv', String.fromCodePoint(0x3164).repeat(2))
    )

    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, tempLogFile)
    await app.logLocationButtonCoh2.click()
    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('a name with only invisible characters shows a placeholder in the row and the player card', async () => {
    const name = app.playerRows.getByTestId('player-name').filter({ hasText: '(no name)' })
    // the card shows full details only when the extra info has loaded before the click
    await expect(name).toHaveAttribute('title', /games played/)
    await name.click()
    await expect(app.playerCardName).toHaveText('(no name)')
})
