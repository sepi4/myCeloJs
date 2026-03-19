import { test, expect } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import fs from 'fs'
import http from 'http'
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

test('localhost server serves HTML overlay page', async () => {
    const portFile = path.join(tempUserDataDir, 'localhostFiles', 'port.js')
    const portContent = fs.readFileSync(portFile, 'utf-8')
    const port = portContent.match(/\d+/)![0]

    // The root serves an HTML page with SSE script
    const response = await fetch(`http://localhost:${port}`)
    expect(response.ok).toBe(true)
    const html = await response.text()
    expect(html).toContain('EventSource')
    expect(html).toContain('/events')
})

test('SSE endpoint pushes rankings matching the written JSON file', async () => {
    const portFile = path.join(tempUserDataDir, 'localhostFiles', 'port.js')
    const portContent = fs.readFileSync(portFile, 'utf-8')
    const port = portContent.match(/\d+/)![0]

    // Connect to SSE via raw HTTP and read the first data line
    const sseData = await new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('SSE timeout')), 5000)
        http.get(`http://localhost:${port}/events`, (res) => {
            let buffer = ''
            res.on('data', (chunk: Buffer) => {
                buffer += chunk.toString()
                // SSE format: "data: ...\n\n"
                const match = buffer.match(/^data: (.+)\n\n/m)
                if (match) {
                    clearTimeout(timeout)
                    res.destroy()
                    resolve(match[1])
                }
            })
            res.on('error', () => {
                clearTimeout(timeout)
                reject(new Error('SSE connection error'))
            })
        })
    })

    // The SSE data should contain player names from the rankings JSON file
    const jsonFile = path.join(tempUserDataDir, 'localhostFiles', 'rankings.json')
    const fileContent = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'))
    for (const player of [...fileContent.teams.team1, ...fileContent.teams.team2]) {
        expect(sseData).toContain(player.name)
    }
})
