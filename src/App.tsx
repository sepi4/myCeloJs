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

import electron from 'electron'
import { useAppDispatch, useAppSelector } from './hooks/customReduxHooks'
import { Player } from './types'
import { guessRankings } from './functions/guessRankings'
const appVersion = electron.remote.app.getVersion()
const settingsDir = electron.remote.app.getPath('userData')

document.title = 'myCelo ' + appVersion

function App() {
    const [playAudio] = useSound(audioLocation)

    const dispatch = useAppDispatch()
    const state = useAppSelector((state) => state)

    const writeNewRankingsFile = (data: Player[]) => {
        dispatch({
            type: 'CLEAR_EXTRA_INFO',
        })
        if (state.settings) {
            writeRankings(state.navButtons.coh3, data, state.settings.rankingsHorizontal)
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
                newSettings.appLocation = state.appLocation

                // update rankingsFile location, for cases where
                // app location is different
                if (newSettings.rankingsFile) {
                    newSettings.rankingsFile =
                        state.appLocation +
                        '\\localhostFiles\\rankings.' +
                        (newSettings.rankingsHtml ? 'html' : 'txt')
                }
                writeSettings(newSettings, dispatch)
            })
            return
        } else if (state.players === null) {
            // initial readLog
            if (!state.autoLogChecking) {
                return
            }

            if (state.settings && state.settings.logLocation) {
                readLog(state.navButtons.coh3, state.settings.logLocation).then(
                    (data) => {
                        if (data) {
                            checkLogData({ data, state, dispatch })
                        }
                    }
                )
            }
        } else if (state.extraInfo === null && state.players.length > 0) {
            const players: Player[] = state.players

            const ids: number[] = []
            for (const p of players) {
                if (p.profileId) {
                    ids.push(p.profileId)
                }
            }

            getExtraInfo(state.navButtons.coh3, ids, (result, x) => {
                if (!x) {
                    return
                }

                const teams = guessRankings(
                    state.navButtons.coh3,
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

                dispatch({
                    type: 'SET_EXTRA_INFO',
                    data: {
                        extraInfo: result,
                        newPlayers,
                    },
                })

                writeRankings(state.navButtons.coh3, newPlayers, state.settings.rankingsHorizontal)
            })
        }

        if (!state.autoLogChecking) {
            return
        }

        const intervalId = setInterval(() => {
            if (state.settings && state.settings.logLocation) {
                readLog(state.navButtons.coh3, state.settings.logLocation).then(
                    (data) => {
                        if (data) {
                            if (state.alert) {
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
        }, state.logCheckInterval * 1000)

        return () => clearInterval(intervalId)
    })

    useEffect(() => {
        if (!state.autoLogChecking) {
            return
        }
        if (state.settings && state.settings.logLocation) {
            readLog(state.navButtons.coh3, state.settings.logLocation).then(
                (data) => {
                    if (data) {
                        writeNewRankingsFile(data)
                    }
                }
            )
        }
    }, [state.settings])

    const handleSetSettingsView = () => {
        if (!state.autoLogChecking) {
            return
        }
        if (state.settings && state.settings.logLocation) {
            readLog(state.navButtons.coh3, state.settings.logLocation).then(
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
