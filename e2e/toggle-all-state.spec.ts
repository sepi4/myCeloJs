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

    await app.settingsIcon.click()
    await app.mockFileDialog(electronApp, COH2_LOG_PATH)
    await app.logLocationButtonCoh2.click()
    await app.closeButton.click()
    await expect(app.playersContainer).toBeVisible()
})

test.afterAll(async () => {
    await closeApp(electronApp, tempUserDataDir)
})

test('team toggle shows closed after its players are closed one by one', async () => {
    const team = app.teamContainers.first()
    const teamToggle = team.getByTestId('team-toggle')
    const playerToggles = team.getByTestId('player-toggle')

    await teamToggle.click()
    await expect(teamToggle).toHaveAttribute('aria-expanded', 'true')
    const count = await playerToggles.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
        await playerToggles.nth(i).click()
    }
    await expect(team.getByTestId('player-extra-info')).toHaveCount(0)
    await expect(teamToggle).toHaveAttribute('aria-expanded', 'false')

    // one click opens the team again
    await teamToggle.click()
    await expect(team.getByTestId('player-extra-info')).toHaveCount(count)

    await teamToggle.click()
    await expect(team.getByTestId('player-extra-info')).toHaveCount(0)
})

test('ranks toggle shows closed after its ranks are closed one by one', async () => {
    // open both teams and use the first player who has team ranks
    await app.teamToggles.nth(0).click()
    await app.teamToggles.nth(1).click()
    const info = app.playerExtraInfos.filter({ has: page.getByTestId('ranks-toggle-all') }).first()
    const ranksToggle = info.getByTestId('ranks-toggle-all')
    const rankToggles = info.getByTestId('rank-toggle')
    await expect(ranksToggle).toBeVisible()

    await ranksToggle.click()
    await expect(ranksToggle).toHaveAttribute('aria-expanded', 'true')
    const count = await rankToggles.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
        await rankToggles.nth(i).click()
    }
    await expect(ranksToggle).toHaveAttribute('aria-expanded', 'false')
    await expect(rankToggles.first()).toHaveAttribute('aria-expanded', 'false')

    // one click opens all ranks again
    await ranksToggle.click()
    for (let i = 0; i < count; i++) {
        await expect(rankToggles.nth(i)).toHaveAttribute('aria-expanded', 'true')
    }
})
