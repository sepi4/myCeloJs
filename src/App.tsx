import { useEffect } from 'react'

import useSound from 'use-sound'
import audioLocation from './bell.mp3'

// components
import Navbar from './components/Navbar/Navbar'
import UpdateBar from './components/UpdateBar'
import MainView from './components/MainView'

// functions
import { writeRankings } from './functions/writeRankings'
import { readSettings } from './functions/readSettings'
import { getExtraInfo } from './functions/getExtraInfo'
import { readLog } from './functions/readLog/readLog'
import writeSettings from './functions/writeSettings'
import checkLogData from './functions/checkLogData'

import { useAlertStore } from './stores/alertStore'
import { useAppLocationStore } from './stores/appLocationStore'
import { useAutoLogCheckingStore } from './stores/autoLogCheckingStore'
import { useExtraInfoStore } from './stores/extraInfoStore'
import { useLogCheckIntervalStore } from './stores/logCheckIntervalStore'
import { useNavButtonsStore } from './stores/navButtonsStore'
import { usePlayersStore } from './stores/playersStore'
import { useSettingsStore } from './stores/settingsStore'
import { Player } from './types'
import { guessRankings } from './functions/guessRankings'
const appVersion = window.electronAPI.appVersion
const settingsDir = window.electronAPI.settingsDir

document.title = 'myCelo ' + appVersion

function App() {
    const [playAudio] = useSound(audioLocation)

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
        ? coh3 ? settings.logLocationCoh3 : settings.logLocationCoh2
        : ''

    // Auto-select the game radio when only one log location is configured
    useEffect(() => {
        if (!settings) return
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
                        sep + 'localhostFiles' + sep + 'rankings.' +
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
                readLog(coh3, activeLogLocation).then((data) => {
                    if (data) {
                        checkLogData({ data })
                    }
                })
            }
        } else if (extraInfo === null && players.length > 0) {
            const ids: number[] = []
            for (const p of players) {
                if (p.profileId) {
                    ids.push(p.profileId)
                }
            }

            getExtraInfo(coh3, ids, (result, x) => {
                if (!x) {
                    return
                }

                const teams = guessRankings(
                    players,
                    x.personalStats,
                    x.cohTitles
                )
                const newPlayers: Player[] = []
                if (teams) {
                    teams.forEach((team: Player[]) => {
                        team.forEach((player) => {
                            newPlayers.push(player)
                        })
                    })
                }

                setExtraInfo(result)
                setPlayers(newPlayers)

                writeRankings(coh3, newPlayers, settings.rankingsHorizontal)
            })
        }

        if (!autoLogChecking) {
            return
        }

        const intervalId = setInterval(() => {
            if (settings && activeLogLocation) {
                readLog(coh3, activeLogLocation).then((data) => {
                    if (data) {
                        if (alert) {
                            checkLogData({ data, playAudio })
                        } else {
                            checkLogData({ data })
                        }
                    }
                })
            }
        }, logCheckInterval * 1000)

        return () => clearInterval(intervalId)
    })

    useEffect(() => {
        if (settings && activeLogLocation) {
            readLog(coh3, activeLogLocation).then((data) => {
                if (data) {
                    checkLogData({ data })
                }
            })
        }
    }, [coh3, settings, activeLogLocation])

    const handleSetSettingsView = () => {
        if (!autoLogChecking) {
            return
        }
        if (settings && activeLogLocation) {
            readLog(coh3, activeLogLocation).then((data) => {
                if (data) {
                    checkLogData({ data })
                }
            })
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
