import { _electron as electron } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { App } from './pom/App.pom'

/**
 * Launches an Electron app instance with the given user data directory.
 *
 * Set `MYCELO_DIST_PATH` env var to test a packaged build (e.g. `dist/linux-unpacked/mycelo`).
 * Without it, tests run against the dev build (`out/main/index.js`).
 */
async function launch(tempUserDataDir: string) {
    const distPath = process.env.MYCELO_DIST_PATH

    const electronApp = distPath
        ? await electron.launch({
              executablePath: path.resolve(distPath),
              args: [`--user-data-dir=${tempUserDataDir}`],
          })
        : await electron.launch({
              args: [
                  path.join(__dirname, '../out/main/index.js'),
                  `--user-data-dir=${tempUserDataDir}`,
              ],
          })

    const page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    const app = new App(page)
    return { electronApp, page, app }
}

/**
 * Launches an isolated Electron app instance with a temporary user data directory.
 * Each test file calls this in `beforeAll` to get its own app, enabling parallel execution.
 */
export async function launchApp() {
    const tempUserDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mycelo-e2e-'))
    const result = await launch(tempUserDataDir)
    return { ...result, tempUserDataDir }
}

/**
 * Relaunches the Electron app reusing the same user data directory.
 * Settings persisted to disk (settings.json, localStorage) survive the restart.
 */
export async function relaunchApp(electronApp: ElectronApplication, tempUserDataDir: string) {
    await electronApp.close()
    return launch(tempUserDataDir)
}

/**
 * Closes the Electron app and deletes the temporary user data directory.
 */
export async function closeApp(electronApp: ElectronApplication, tempUserDataDir: string) {
    await electronApp.close()
    fs.rmSync(tempUserDataDir, { recursive: true, force: true })
}
