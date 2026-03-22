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

    // Teams
    readonly teamToggles: Locator
    readonly playerExtraInfos: Locator

    // Navbar
    readonly navbar: Locator
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
    readonly navbarPositionLeft: Locator
    readonly navbarPositionRight: Locator
    readonly navbarPositionTop: Locator
    readonly languageTitle: Locator
    readonly languageSelectEn: Locator
    readonly languageSelectRu: Locator
    readonly logLocationButtonCoh2: Locator
    readonly logLocationButtonCoh3: Locator
    readonly clearLogCoh2Button: Locator
    readonly clearLogCoh3Button: Locator
    readonly steamIdInput: Locator
    readonly steamIdSave: Locator
    readonly steamIdError: Locator
    readonly steamIdSuccess: Locator
    readonly resetSettingsButton: Locator
    readonly resetConfirmOk: Locator
    readonly resetConfirmCancel: Locator

    // Navbar checkboxes
    readonly checkboxAll: Locator
    readonly checkboxTotal: Locator
    readonly checkboxTable: Locator

    // Font size
    readonly fontSizeSmall: Locator
    readonly fontSizeMedium: Locator
    readonly fontSizeLarge: Locator

    // OBS / rankings settings
    readonly radioHtml: Locator
    readonly radioTxt: Locator
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
    readonly linkCoh3stats: Locator
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
        this.teamToggles = page.getByTestId('team-toggle')
        this.playerExtraInfos = page.getByTestId('player-extra-info')

        this.navbar = page.getByTestId('navbar')
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

        this.navbarPositionLeft = page.getByTestId('navbar-position-left')
        this.navbarPositionRight = page.getByTestId('navbar-position-right')
        this.navbarPositionTop = page.getByTestId('navbar-position-top')
        this.languageTitle = page.getByTestId('language-title')
        this.languageSelectEn = page.getByTestId('language-select-en')
        this.languageSelectRu = page.getByTestId('language-select-ru')
        this.logLocationButtonCoh2 = page.getByTestId('log-location-button-coh2')
        this.logLocationButtonCoh3 = page.getByTestId('log-location-button-coh3')
        this.clearLogCoh2Button = page.getByTestId('clear-log-coh2-button')
        this.clearLogCoh3Button = page.getByTestId('clear-log-coh3-button')
        this.steamIdInput = page.getByTestId('steam-id-input')
        this.steamIdSave = page.getByTestId('steam-id-save')
        this.steamIdError = page.getByTestId('steam-id-error')
        this.steamIdSuccess = page.getByTestId('steam-id-success')
        this.resetSettingsButton = page.getByTestId('reset-settings-button')
        this.resetConfirmOk = page.getByTestId('reset-confirm-ok')
        this.resetConfirmCancel = page.getByTestId('reset-confirm-cancel')

        this.fontSizeSmall = page.getByTestId('font-size-small')
        this.fontSizeMedium = page.getByTestId('font-size-medium')
        this.fontSizeLarge = page.getByTestId('font-size-large')

        this.radioHtml = page.getByTestId('radio-html')
        this.radioTxt = page.getByTestId('radio-txt')
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
        this.linkCoh3stats = page.getByTestId('link-coh3stats')
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

    /**
     * Stubs Electron's native file-open dialog so it resolves immediately
     * with the given {@link filePath} instead of showing a real OS dialog.
     */
    async mockFileDialog(electronApp: ElectronApplication, filePath: string) {
        await electronApp.evaluate(async ({ dialog }, fp) => {
            dialog.showOpenDialog = () => Promise.resolve({ canceled: false, filePaths: [fp] })
        }, filePath)
    }
}
