import { type Page, type Locator, type ElectronApplication } from '@playwright/test'
import path from 'path'

export const COH2_LOG_PATH = path.join(__dirname, '../../dataExamples/coh2-warnings.log')
export const COH2_LOG_PATH_2 = path.join(__dirname, '../../dataExamples/coh2-warnings2.log')
export const COH3_LOG_PATH = path.join(__dirname, '../../dataExamples/coh3-warnings.log')
export const STEAM_ID = '76561198006675368'

export class App {
    readonly page: Page

    // Main view
    readonly noLogPrompt: Locator
    readonly playersContainer: Locator
    readonly teamContainers: Locator

    // Navbar
    readonly settingsIcon: Locator
    readonly userIcon: Locator
    readonly searchIcon: Locator
    readonly closeButton: Locator
    readonly autoLabel: Locator
    readonly alertLabel: Locator
    readonly checkLogButton: Locator
    readonly intervalInput: Locator
    readonly radioCoh2: Locator
    readonly radioCoh3: Locator

    // Search
    readonly searchInput: Locator
    readonly searchResults: Locator
    readonly foundPlayers: Locator

    // Settings
    readonly languageTitle: Locator
    readonly languageSelect: Locator
    readonly logLocationButtonCoh2: Locator
    readonly logLocationButtonCoh3: Locator
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
    readonly linkCoh2stats: Locator
    readonly linkCoh2: Locator
    readonly linkSteam: Locator

    // Game history
    readonly fetchHistory: Locator
    readonly gameHistory: Locator
    readonly gameHistoryItems: Locator
    readonly gameModal: Locator
    readonly gameStart: Locator
    readonly gameEnd: Locator
    readonly tableView: Locator
    readonly totalGames: Locator
    readonly rankRows: Locator

    constructor(page: Page) {
        this.page = page

        this.noLogPrompt = page.getByTestId('no-log-prompt')
        this.playersContainer = page.getByTestId('players-container')
        this.teamContainers = page.getByTestId('team-container')

        this.settingsIcon = page.getByTestId('settings-icon')
        this.userIcon = page.getByTestId('user-icon')
        this.searchIcon = page.getByTestId('search-icon')
        this.closeButton = page.getByTestId('close-button')
        this.autoLabel = page.getByTestId('auto-label')
        this.alertLabel = page.getByTestId('alert-label')
        this.checkLogButton = page.getByTestId('check-log-button')
        this.intervalInput = page.getByTestId('interval-input')
        this.radioCoh2 = page.getByTestId('radio-coh2')
        this.radioCoh3 = page.getByTestId('radio-coh3')

        this.searchInput = page.getByTestId('search-input')
        this.searchResults = page.getByTestId('search-results')
        this.foundPlayers = page.getByTestId('found-player')

        this.languageTitle = page.getByTestId('language-title')
        this.languageSelect = page.getByTestId('language-select')
        this.logLocationButtonCoh2 = page.getByTestId('log-location-button-coh2')
        this.logLocationButtonCoh3 = page.getByTestId('log-location-button-coh3')
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
        this.linkCoh2stats = page.getByTestId('link-coh2stats')
        this.linkCoh2 = page.getByTestId('link-coh2')
        this.linkSteam = page.getByTestId('link-steam')

        this.fetchHistory = page.getByTestId('fetch-history')
        this.gameHistory = page.getByTestId('game-history')
        this.gameHistoryItems = page.getByTestId('game-history-item')
        this.gameModal = page.getByTestId('game-modal')
        this.gameStart = page.getByTestId('game-start')
        this.gameEnd = page.getByTestId('game-end')
        this.tableView = page.getByTestId('table-view')
        this.totalGames = page.getByTestId('total-games')
        this.rankRows = page.getByTestId('rank-row')
    }

    async mockFileDialog(electronApp: ElectronApplication, filePath: string) {
        await electronApp.evaluate(async ({ dialog }, fp) => {
            dialog.showOpenDialog = () => Promise.resolve({ canceled: false, filePaths: [fp] })
        }, filePath)
    }
}
