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

import { useAppDispatch, useAppSelector } from './hooks/customReduxHooks'
import { useAlertStore } from './stores/alertStore'
import { useAppLocationStore } from './stores/appLocationStore'
import { useAutoLogCheckingStore } from './stores/autoLogCheckingStore'
import { useExtraInfoStore } from './stores/extraInfoStore'
import { useLogCheckIntervalStore } from './stores/logCheckIntervalStore'
import { useNavButtonsStore } from './stores/navButtonsStore'
import { usePlayersStore } from './stores/playersStore'
import { Player } from './types'
import { guessRankings } from './functions/guessRankings'
const appVersion = window.electronAPI.appVersion
const settingsDir = window.electronAPI.settingsDir

document.title = 'myCelo ' + appVersion

function App() {
    const [playAudio] = useSound(audioLocation)

    const dispatch = useAppDispatch()
    const state = useAppSelector((state) => state)
    const { alert } = useAlertStore()
    const { appLocation } = useAppLocationStore()
    const { autoLogChecking } = useAutoLogCheckingStore()
    const { extraInfo, setExtraInfo, clearExtraInfo } = useExtraInfoStore()
    const { logCheckInterval } = useLogCheckIntervalStore()
    const { navButtons: { coh3 } } = useNavButtonsStore()
    const { players, setPlayers } = usePlayersStore()

    const writeNewRankingsFile = (data: Player[]) => {
        clearExtraInfo()
        if (state.settings) {
            writeRankings(coh3, data, state.settings.rankingsHorizontal)
        }
    }

    useEffect(() => {
        // initial readSettings location of log file
        if (state.settings === null) {
            readSettings(settingsDir + '/settings.json', (data) => {
                if (!data) {
                    return
                }

                const newSettings = JSON.parse(data)
                newSettings.appLocation = appLocation

                // update rankingsFile location, for cases where
                // app location is different
                if (newSettings.rankingsFile) {
                    newSettings.rankingsFile =
                        appLocation +
                        '\\localhostFiles\\rankings.' +
                        (newSettings.rankingsHtml ? 'html' : 'txt')
                }
                writeSettings(newSettings, dispatch)
            })
            return
        } else if (players === null) {
            // initial readLog
            if (!autoLogChecking) {
                return
            }

            if (state.settings && state.settings.logLocation) {
                readLog(coh3, state.settings.logLocation).then(
                    (data) => {
                        if (data) {
                            checkLogData({ data, state, dispatch })
                        }
                    }
                )
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
                    coh3,
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
                dispatch({
                    type: 'SET_EXTRA_INFO',
                    data: { newPlayers },
                })

                writeRankings(coh3, newPlayers, state.settings.rankingsHorizontal)
            })
        }

        if (!autoLogChecking) {
            return
        }

        const intervalId = setInterval(() => {
            if (state.settings && state.settings.logLocation) {
                readLog(coh3, state.settings.logLocation).then(
                    (data) => {
                        if (data) {
                            if (alert) {
                                checkLogData({
                                    data,
                                    state,
                                    dispatch,
                                    playAudio,
                                })
                            } else {
                                checkLogData({ data, state, dispatch })
                            }
                        }
                    }
                )
            }
        }, logCheckInterval * 1000)

        return () => clearInterval(intervalId)
    })

    useEffect(() => {
        if (!autoLogChecking) {
            return
        }
        if (state.settings && state.settings.logLocation) {
            readLog(coh3, state.settings.logLocation).then(
                (data) => {
                    if (data) {
                        writeNewRankingsFile(data)
                    }
                }
            )
        }
    }, [state.settings])

    const handleSetSettingsView = () => {
        if (!autoLogChecking) {
            return
        }
        if (state.settings && state.settings.logLocation) {
            readLog(coh3, state.settings.logLocation).then(
                (data) => {
                    if (data) {
                        checkLogData({ data, state, dispatch })
                    }
                }
            )
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

            {state.settings && <UpdateBar />}
        </main>
    )
}

export default App
