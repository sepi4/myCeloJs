import { type Page, type Locator, type ElectronApplication } from '@playwright/test'
import path from 'path'

export const LOG_PATH = path.join(__dirname, '../../dataExamples/warnings.log')
export const STEAM_ID = '76561198006675368'

export class AppPage {
    readonly page: Page

    // Main view
    readonly noLogPrompt: Locator
    readonly playersContainer: Locator

    // Navbar
    readonly settingsIcon: Locator
    readonly userIcon: Locator
    readonly closeButton: Locator
    readonly autoLabel: Locator

    // Settings
    readonly languageTitle: Locator
    readonly languageSelect: Locator
    readonly logLocationButton: Locator
    readonly steamIdInput: Locator
    readonly steamIdSave: Locator
    readonly steamIdError: Locator
    readonly steamIdSuccess: Locator

    // Player card
    readonly steamIdValue: Locator

    constructor(page: Page) {
        this.page = page

        this.noLogPrompt = page.getByTestId('no-log-prompt')
        this.playersContainer = page.getByTestId('players-container')

        this.settingsIcon = page.getByTestId('settings-icon')
        this.userIcon = page.getByTestId('user-icon')
        this.closeButton = page.getByTestId('close-button')
        this.autoLabel = page.getByTestId('auto-label')

        this.languageTitle = page.getByTestId('language-title')
        this.languageSelect = page.getByTestId('language-select')
        this.logLocationButton = page.getByTestId('log-location-button')
        this.steamIdInput = page.getByTestId('steam-id-input')
        this.steamIdSave = page.getByTestId('steam-id-save')
        this.steamIdError = page.getByTestId('steam-id-error')
        this.steamIdSuccess = page.getByTestId('steam-id-success')

        this.steamIdValue = page.getByTestId('steam-id-value')
    }

    async mockFileDialog(electronApp: ElectronApplication, filePath: string) {
        await electronApp.evaluate(async ({ dialog }, fp) => {
            dialog.showOpenDialog = () =>
                Promise.resolve({ canceled: false, filePaths: [fp] })
        }, filePath)
    }
}
