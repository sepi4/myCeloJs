import { useEffect } from 'react'

import audioLocation from './assets/audio/bell.mp3'
import MainView from './components/MainView'
// components
import Navbar from './components/Navbar/Navbar'
import UpdateBar from './components/UpdateBar'
import checkLogData from './functions/checkLogData'
import { fetchCoh2ProfileId } from './functions/fetchCoh2ProfileId'
import { getExtraInfo } from './functions/getExtraInfo'
import { getLocalUserInfoCoh3 } from './functions/readLog/getLocalUserInfoCoh3'
import { readLog } from './functions/readLog/readLog'
import { readSettings } from './functions/readSettings'
import { resolveRankings } from './functions/resolveRankings'
// functions
import { writeRankings } from './functions/writeRankings'
import writeSettings from './functions/writeSettings'
import { useAlertStore } from './stores/alertStore'
import { useAppLocationStore } from './stores/appLocationStore'
import { useAutoLogCheckingStore } from './stores/autoLogCheckingStore'
import { useExtraInfoStore } from './stores/extraInfoStore'
import { useLogCheckIntervalStore } from './stores/logCheckIntervalStore'
import { useNavButtonsStore } from './stores/navButtonsStore'
import { usePlayersStore } from './stores/playersStore'
import { useSettingsStore } from './stores/settingsStore'
import { Player, SettingsType } from './types'
const appVersion = window.electronAPI.appVersion
const settingsDir = window.electronAPI.settingsDir

document.title = 'myCelo ' + appVersion

function App() {
    const playAudio = () => new Audio(audioLocation).play()

    const { alert } = useAlertStore()
    const { appLocation } = useAppLocationStore()
    const { autoLogChecking } = useAutoLogCheckingStore()
    const { extraInfo, setExtraInfo } = useExtraInfoStore()
    const { logCheckInterval } = useLogCheckIntervalStore()
    const {
        navButtons: { coh3 },
        toggleNavButton,
    } = useNavButtonsStore()
    const { players, setPlayers } = usePlayersStore()
    const { settings } = useSettingsStore()
    const activeLogLocation = settings
        ? coh3
            ? settings.logLocationCoh3
            : settings.logLocationCoh2
        : ''

    // Auto-select the game radio when only one log location is configured
    useEffect(() => {
        if (!settings) {
            return
        }
        const hasCoh2 = !!settings.logLocationCoh2
        const hasCoh3 = !!settings.logLocationCoh3
        if (hasCoh3 && !hasCoh2 && !coh3) {
            toggleNavButton('coh3')
        } else if (hasCoh2 && !hasCoh3 && coh3) {
            toggleNavButton('coh3')
        }
    }, [settings, coh3, toggleNavButton])

    useEffect(() => {
        // initial readSettings location of log file
        if (settings === null) {
            readSettings(settingsDir + '/settings.json', (data) => {
                if (!data) {
                    return
                }

                const newSettings = JSON.parse(data)
                newSettings.appLocation = appLocation

                // update rankingsFile location, for cases where
                // app location is different
                if (newSettings.rankingsFile) {
                    const sep = window.electronAPI.pathSep
                    newSettings.rankingsFile =
                        appLocation +
                        sep +
                        'localhostFiles' +
                        sep +
                        'rankings.' +
                        (newSettings.rankingsHtml ? 'html' : 'txt')
                }
                writeSettings(newSettings)
            })
            return
        } else if (players === null) {
            // initial readLog
            if (!autoLogChecking) {
                return
            }

            if (settings && activeLogLocation) {
                async function readInitialLog() {
                    const data = await readLog(coh3, activeLogLocation)
                    if (data) {
                        checkLogData({ data })
                    }
                }
                readInitialLog()
            }
        } else if (extraInfo === null && players.length > 0) {
            const currentPlayers = players
            const currentSettings = settings
            const ids: number[] = []
            for (const p of currentPlayers) {
                if (p.profileId) {
                    ids.push(p.profileId)
                }
            }

            async function fetchExtraInfo() {
                const x = await getExtraInfo(coh3, ids)
                if (!x) {
                    return
                }

                const teams = resolveRankings(currentPlayers, x.personalStats, x.cohTitles)
                const newPlayers: Player[] = []
                if (teams) {
                    teams.forEach((team: Player[]) => {
                        team.forEach((player) => {
                            newPlayers.push(player)
                        })
                    })
                }

                setExtraInfo(x.result)
                setPlayers(newPlayers)

                writeRankings(coh3, newPlayers, currentSettings.rankingsHorizontal)
            }
            fetchExtraInfo()
        }

        if (!autoLogChecking) {
            return
        }

        async function checkLog() {
            if (settings && activeLogLocation) {
                const data = await readLog(coh3, activeLogLocation)
                if (data) {
                    if (alert) {
                        checkLogData({ data, playAudio })
                    } else {
                        checkLogData({ data })
                    }
                }
            }
        }
        const intervalId = setInterval(checkLog, logCheckInterval * 1000)

        return () => clearInterval(intervalId)
    })

    useEffect(() => {
        if (settings && activeLogLocation) {
            async function readLogOnChange() {
                const data = await readLog(coh3, activeLogLocation)
                if (data) {
                    checkLogData({ data })
                }
            }
            readLogOnChange()
        }
    }, [coh3, settings, activeLogLocation])

    useEffect(() => {
        if (!coh3 || !settings?.logLocationCoh3) {
            return
        }
        const currentSettings = settings
        async function updateCoh3ProfileId() {
            const data = await window.electronAPI.log.read(currentSettings.logLocationCoh3)
            if (!data) {
                return
            }
            const info = getLocalUserInfoCoh3(data.split('\n'))
            if (!info) {
                return
            }
            if (currentSettings.profileIdCoh3 === info.profileId) {
                return
            }
            writeSettings({
                ...currentSettings,
                profileIdCoh3: info.profileId,
            } as SettingsType)
        }
        updateCoh3ProfileId()
    }, [coh3, settings, settings?.logLocationCoh3])

    useEffect(() => {
        if (!settings?.steamId) {
            return
        }
        const currentSettings = settings
        async function updateCoh2ProfileId() {
            const profileId = await fetchCoh2ProfileId(currentSettings.steamId)
            if (!profileId || currentSettings.profileIdCoh2 === profileId) {
                return
            }
            writeSettings({ ...currentSettings, profileIdCoh2: profileId })
        }
        updateCoh2ProfileId()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings?.steamId])

    const handleSetSettingsView = async () => {
        if (!autoLogChecking) {
            return
        }
        if (settings && activeLogLocation) {
            const data = await readLog(coh3, activeLogLocation)
            if (data) {
                checkLogData({ data })
            }
        }
    }

    return (
        <main
            style={{
                marginTop: '4em',
            }}
        >
            <Navbar {...{ handleSetSettingsView }} />
            <MainView handleSetSettingsView={handleSetSettingsView} />

            {settings && <UpdateBar />}
        </main>
    )
}

export default App
