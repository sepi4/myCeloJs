import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import fs from 'fs'
import path from 'path'
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

    // Setup: set COH2 log so rankings get written
    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH2_LOG_PATH)
    await app.logLocationButtonCoh2.click()
    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('localhost server serves rankings JSON matching the written file', async () => {
    // Read the port from the generated port.js file (contains "let port = NNNN")
    const portFile = path.join(tempUserDataDir, 'localhostFiles', 'port.js')
    const portContent = fs.readFileSync(portFile, 'utf-8')
    const port = portContent.match(/\d+/)![0]

    // Fetch rankings from the localhost server
    const response = await fetch(`http://localhost:${port}`)
    expect(response.ok).toBe(true)

    const json = await response.json()

    // Verify the JSON has the expected structure
    expect(json).toHaveProperty('teams')
    expect(json).toHaveProperty('teams.team1')
    expect(json).toHaveProperty('teams.team2')
    expect(json.teams.team1.length).toBeGreaterThan(0)
    expect(json.teams.team2.length).toBeGreaterThan(0)

    // Verify each player has the required fields
    for (const player of [...json.teams.team1, ...json.teams.team2]) {
        expect(player).toHaveProperty('name')
        expect(player).toHaveProperty('ranking')
        expect(player).toHaveProperty('country')
        expect(player).toHaveProperty('faction')
    }

    // Verify the JSON matches what was written to disk
    const jsonFile = path.join(tempUserDataDir, 'localhostFiles', 'rankings.json')
    const fileContent = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'))
    expect(json).toEqual(fileContent)
})
