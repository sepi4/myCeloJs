import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector, } from 'react-redux'

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
const appVersion = electron.remote.app.getVersion()
const settingsDir = electron.remote.app.getPath('userData')

document.title = 'myCelo ' + appVersion

function App() {
    const [playAudio] = useSound(audioLocation)

    const dispatch = useDispatch()
    const state = useSelector(state => state)

    const writeNewRankingsFile = data => {
        dispatch({
            type: 'CLEAR_EXTRA_INFO',
        })
        if (state.settings) {
            writeRankings(
                data,
                state.settings.rankingsHtml,
                state.settings.rankingsHorizontal,
                'writeNewRankingsFile'
            )
        }
    }

    useEffect(() => {
        // initial readSettings location of log file
        if (state.settings === null) {
            readSettings(settingsDir + '/settings.json', (data) => {
                if (!data) {
                    return
                }

                let newSettings = JSON.parse(data)
                newSettings.appLocation = state.appLocation

                // update rankingsFile location, for cases where 
                // app location is different
                if (newSettings.rankingsFile) {
                    newSettings.rankingsFile = state.appLocation
                        + '\\localhostFiles\\rankings.'
                        + (newSettings.rankingsHtml ? 'html' : 'txt')
                }
                writeSettings(newSettings, dispatch)
            })
            return

        } else if (state.players === null) { // initial readLog
            if (!state.autoLogChecking) {
                return
            }

            if (state.settings && state.settings.logLocation) {
                readLog(state.settings.logLocation, data => {
                    checkLogData(data, state, dispatch)
                })
            }
        } else if (state.extraInfo === null && state.players.length > 0) {
            getExtraInfo(state.players, (data, teams) => {
                // debugger
                let newPlayers = []
                teams.forEach(team => {
                    team.forEach(player => {
                        newPlayers.push(player)
                    })
                })

                dispatch({
                    type: 'SET_EXTRA_INFO',
                    data: {
                        extraInfo: data,
                        newPlayers,
                    },
                })

                writeRankings(
                    newPlayers,
                    state.settings.rankingsHtml,
                    state.settings.rankingsHorizontal,
                    'useEffect'
                )

            })
        }

        if (!state.autoLogChecking) {
            return
        }

        const intervalId = setInterval(() => {
            if (state.settings && state.settings.logLocation) {
                readLog(state.settings.logLocation, data => {
                    if (state.alert) {
                        checkLogData(data, state, dispatch, playAudio)
                    } else {
                        checkLogData(data, state, dispatch)
                    }
                })
            }
        }, state.logCheckInterval * 1000)

        return () => clearInterval(intervalId)
    })

    useEffect(() => {
        if (!state.autoLogChecking) {
            return
        }
        if (state.settings && state.settings.logLocation) {
            readLog(state.settings.logLocation, writeNewRankingsFile)
        }
    }, [state.settings])

    const handleSetSettingsView = () => {
        if (!state.autoLogChecking) {
            return
        }
        if (state.settings && state.settings.logLocation) {
            readLog(state.settings.logLocation, data => {
                checkLogData(data, state, dispatch)
            })
        }
    }

    return <main style={{
        marginTop: '4em',
    }} >
        <Navbar {...{ handleSetSettingsView }} />
        <MainView />

        {state.settings &&
            <UpdateBar appVersion={appVersion} />
        }
    </main>
}

export default App
