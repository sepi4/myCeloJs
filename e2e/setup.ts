import { _electron as electron } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { App } from './pom/App.pom'

/**
 * Launches an isolated Electron app instance with a temporary user data directory.
 * Each test file calls this in `beforeAll` to get its own app, enabling parallel execution.
 */
export async function launchApp() {
    const tempUserDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mycelo-e2e-'))
    const electronApp = await electron.launch({
        args: [path.join(__dirname, '../out/main/index.js'), `--user-data-dir=${tempUserDataDir}`],
    })
    const page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    const app = new App(page)
    return { electronApp, page, app, tempUserDataDir }
}

/**
 * Closes the Electron app and deletes the temporary user data directory.
 */
export async function closeApp(electronApp: ElectronApplication, tempUserDataDir: string) {
    await electronApp.close()
    fs.rmSync(tempUserDataDir, { recursive: true, force: true })
}
