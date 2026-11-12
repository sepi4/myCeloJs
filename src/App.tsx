import { useEffect } from 'react'

import audioLocation from './assets/audio/bell.mp3'
import MainView from './components/MainView'
// components
import Navbar from './components/Navbar/Navbar'
import UpdateBar from './components/UpdateBar'
import { GAME_CONFIG } from './constants/games'
import { fetchCoh2ProfileId } from './functions/api/fetchCoh2ProfileId'
import { getExtraInfo } from './functions/api/getExtraInfo'
import checkLogData from './functions/checkers/checkLogData'
import { getLocalUserInfoCoh3 } from './functions/log-parsing/getLocalUserInfoCoh3'
import { readLog } from './functions/log-parsing/readLog'
import { resolveRankings } from './functions/rankings/resolveRankings'
// functions
import { writeRankings } from './functions/rankings/writeRankings'
import { readSettings } from './functions/settings/readSettings'
import writeSettings, { updateSettings } from './functions/settings/writeSettings'
import { useAlertStore } from './stores/alertStore'
import { useAutoLogCheckingStore } from './stores/autoLogCheckingStore'
import { useExtraInfoStore } from './stores/extraInfoStore'
import { useGameStore } from './stores/gameStore'
import { useLogCheckIntervalStore } from './stores/logCheckIntervalStore'
import { useNavButtonsStore } from './stores/navButtonsStore'
import { usePlayersStore } from './stores/playersStore'
import { useSettingsStore } from './stores/settingsStore'
import { Player } from './types'

import styles from './App.module.css'
const appVersion = window.electronAPI.appVersion

document.title = 'myCelo ' + appVersion

const playAudio = () => new Audio(audioLocation).play()

function App() {
    const { alert } = useAlertStore()
    const { autoLogChecking } = useAutoLogCheckingStore()
    const { extraInfo, setExtraInfo } = useExtraInfoStore()
    const { logCheckInterval } = useLogCheckIntervalStore()
    const { game, setGame } = useGameStore()
    const {
        navButtons: { elo },
    } = useNavButtonsStore()
    const { players, setPlayers } = usePlayersStore()
    const { settings } = useSettingsStore()
    const activeLogLocation = settings?.[GAME_CONFIG[game].logLocationKey] ?? ''

    // Auto-select COH2/COH3 radio when only one log location is configured
    useEffect(() => {
        if (!settings) {
            return
        }
        const hasCoh2 = !!settings.logLocationCoh2
        const hasCoh3 = !!settings.logLocationCoh3
        if (hasCoh3 && !hasCoh2) {
            setGame('coh3')
        } else if (hasCoh2 && !hasCoh3) {
            setGame('coh2')
        }
    }, [settings, setGame])

    // Load settings from disk on startup
    useEffect(() => {
        if (settings !== null) {
            return
        }
        async function loadSettings() {
            const savedSettings = await readSettings()
            if (!savedSettings) {
                return
            }
            window.electronAPI.rankings.setFormat(savedSettings.rankingsHtml ? 'html' : 'txt')
            writeSettings(savedSettings)
        }
        loadSettings()
    }, [settings])

    // Fetch ranks and countries for the players read from the log
    useEffect(() => {
        if (!players || players.length === 0 || extraInfo !== null) {
            return
        }
        const ids: number[] = []
        for (const p of players) {
            if (p.profileId) {
                ids.push(p.profileId)
            }
        }

        // The log may be re-read while the request is in flight
        let cancelled = false
        async function fetchExtraInfo(currentPlayers: Player[]) {
            const x = await getExtraInfo(game, ids)
            if (!x || cancelled) {
                return
            }
            const teams = resolveRankings(currentPlayers, x.personalStats, x.cohTitles)
            setExtraInfo(x.result)
            setPlayers(teams.flat())
        }
        fetchExtraInfo(players)

        return () => {
            cancelled = true
        }
    }, [game, players, extraInfo, setExtraInfo, setPlayers])

    // Poll the log on an interval
    useEffect(() => {
        if (!autoLogChecking || !activeLogLocation) {
            return
        }
        async function checkLog() {
            const data = await readLog(game, activeLogLocation)
            checkLogData({ data, playAudio: alert ? playAudio : undefined })
        }
        const intervalId = setInterval(checkLog, logCheckInterval * 1000)

        return () => clearInterval(intervalId)
    }, [autoLogChecking, activeLogLocation, game, alert, logCheckInterval])

    // Re-read log when game toggle or log location changes
    useEffect(() => {
        if (settings && activeLogLocation) {
            async function readLogOnChange() {
                const data = await readLog(game, activeLogLocation)
                if (data) {
                    checkLogData({ data })
                }
            }
            readLogOnChange()
        }
    }, [game, settings, activeLogLocation])

    // Re-write rankings overlay when orientation or game toggle changes
    useEffect(() => {
        if (settings && players && players.length > 0) {
            writeRankings(
                game,
                players,
                settings.rankingsHorizontal,
                GAME_CONFIG[game].hasElo && elo
            )
        }
    }, [settings, elo, game, players])

    // Sync COH3 profile ID from log file into settings
    useEffect(() => {
        const logLocation = settings?.logLocationCoh3
        if (game !== 'coh3' || !logLocation) {
            return
        }
        const savedProfileId = settings?.profileIdCoh3
        const updateCoh3ProfileId = async () => {
            const data = await window.electronAPI.log.read(logLocation)
            if (!data) {
                return
            }
            const info = getLocalUserInfoCoh3(data.split('\n'))
            if (!info || info.profileId === savedProfileId) {
                return
            }
            updateSettings({ profileIdCoh3: info.profileId })
        }
        updateCoh3ProfileId()
    }, [game, settings])

    // Fetch and sync COH2 profile ID from Steam ID
    useEffect(() => {
        const steamId = settings?.steamId
        if (!steamId) {
            return
        }
        const savedProfileId = settings?.profileIdCoh2
        const updateCoh2ProfileId = async () => {
            const profileId = await fetchCoh2ProfileId(steamId)
            if (!profileId || profileId === savedProfileId) {
                return
            }
            updateSettings({ profileIdCoh2: profileId })
        }
        updateCoh2ProfileId()
    }, [settings])

    // Apply font size to document root
    useEffect(() => {
        const sizeMap = { small: '100%', medium: '125%', large: '150%' } as const
        const scaleMap = { small: '1', medium: '1.25', large: '1.5' } as const
        const size = settings?.fontSize ?? 'small'
        document.documentElement.style.fontSize = sizeMap[size]
        document.documentElement.style.setProperty('--input-scale', scaleMap[size])
    }, [settings?.fontSize])

    // Apply theme to document root
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings?.theme ?? 'dark')
    }, [settings?.theme])

    const handleSetSettingsView = async () => {
        if (!autoLogChecking) {
            return
        }
        if (settings && activeLogLocation) {
            const data = await readLog(game, activeLogLocation)
            if (data) {
                checkLogData({ data })
            }
        }
    }

    return (
        <main
            className={
                settings?.navbarPosition === 'right'
                    ? styles.navbarRight
                    : settings?.navbarPosition === 'left'
                      ? styles.navbarLeft
                      : styles.navbarTop
            }
        >
            <Navbar {...{ handleSetSettingsView }} />
            <MainView handleSetSettingsView={handleSetSettingsView} />

            {settings && <UpdateBar />}
        </main>
    )
}

export default App
