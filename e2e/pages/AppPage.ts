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
    readonly searchIcon: Locator
    readonly closeButton: Locator
    readonly autoLabel: Locator

    // Search
    readonly searchInput: Locator
    readonly searchResults: Locator
    readonly foundPlayers: Locator

    // Settings
    readonly languageTitle: Locator
    readonly languageSelect: Locator
    readonly logLocationButton: Locator
    readonly steamIdInput: Locator
    readonly steamIdSave: Locator
    readonly steamIdError: Locator
    readonly steamIdSuccess: Locator

    // Navbar checkboxes
    readonly checkboxAll: Locator
    readonly checkboxTotal: Locator
    readonly checkboxTable: Locator

    // OBS / rankings settings
    readonly radioHtml: Locator
    readonly radioHorizontal: Locator
    readonly copyRankings: Locator
    readonly copyRankingsButton: Locator
    readonly copyRankingsNotification: Locator
    readonly copySettings: Locator
    readonly copySettingsButton: Locator
    readonly copySettingsNotification: Locator

    // Player card
    readonly steamIdValue: Locator
    readonly tableView: Locator
    readonly totalGames: Locator
    readonly rankRows: Locator

    constructor(page: Page) {
        this.page = page

        this.noLogPrompt = page.getByTestId('no-log-prompt')
        this.playersContainer = page.getByTestId('players-container')

        this.settingsIcon = page.getByTestId('settings-icon')
        this.userIcon = page.getByTestId('user-icon')
        this.searchIcon = page.getByTestId('search-icon')
        this.closeButton = page.getByTestId('close-button')
        this.autoLabel = page.getByTestId('auto-label')

        this.searchInput = page.getByTestId('search-input')
        this.searchResults = page.getByTestId('search-results')
        this.foundPlayers = page.getByTestId('found-player')

        this.languageTitle = page.getByTestId('language-title')
        this.languageSelect = page.getByTestId('language-select')
        this.logLocationButton = page.getByTestId('log-location-button')
        this.steamIdInput = page.getByTestId('steam-id-input')
        this.steamIdSave = page.getByTestId('steam-id-save')
        this.steamIdError = page.getByTestId('steam-id-error')
        this.steamIdSuccess = page.getByTestId('steam-id-success')

        this.radioHtml = page.getByTestId('radio-html')
        this.radioHorizontal = page.getByTestId('radio-horizontal')
        this.copyRankings = page.getByTestId('copy-rankings')
        this.copyRankingsButton = page.getByTestId('copy-rankings-button')
        this.copyRankingsNotification = page.getByTestId('copy-rankings-notification')
        this.copySettings = page.getByTestId('copy-settings')
        this.copySettingsButton = page.getByTestId('copy-settings-button')
        this.copySettingsNotification = page.getByTestId('copy-settings-notification')

        this.checkboxAll = page.getByTestId('checkbox-all')
        this.checkboxTotal = page.getByTestId('checkbox-total')
        this.checkboxTable = page.getByTestId('checkbox-table')

        this.steamIdValue = page.getByTestId('steam-id-value')
        this.tableView = page.getByTestId('table-view')
        this.totalGames = page.getByTestId('total-games')
        this.rankRows = page.getByTestId('rank-row')
    }

    async mockFileDialog(electronApp: ElectronApplication, filePath: string) {
        await electronApp.evaluate(async ({ dialog }, fp) => {
            dialog.showOpenDialog = () =>
                Promise.resolve({ canceled: false, filePaths: [fp] })
        }, filePath)
    }
}
