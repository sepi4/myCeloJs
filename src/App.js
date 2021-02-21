import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector, } from 'react-redux'


// components
import Navbar from './components/Navbar/Navbar'
import UpdateBar from './components/UpdateBar'
import MainView from './components/MainView'

// functions
import { writeRankings } from './functions/writeRankings'
import { readSettings } from './functions/readSettings'
import { getExtraInfo } from './functions/getExtraInfo'
import { readLog } from './functions/readLog'

import electron from 'electron'
import writeSettings from './functions/writeSettings'
const appVersion = electron.remote.app.getVersion()
const settingsDir = electron.remote.app.getPath('userData')

document.title = 'myCelo ' + appVersion

let updateCheckNotDone = true

function App() {
    const READ_LOG_INTERVAL = 3000
    const dispatch = useDispatch()
    const state = useSelector(state => state)

    const checkLogData = data => {
        if (JSON.stringify(state.fromFile) !== JSON.stringify(data)) {
            dispatch({
                type: 'SET_NEW_PLAYERS',
                data,
            })
            if (state.settings) {
                writeRankings(
                    data,
                    state.settings.rankingsHtml,
                    state.settings.rankingsHorizontal,
                    'checkLogData'
                )
            }
        }
    }

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

            // readSettings('./settings.json', (data) => {
            readSettings(settingsDir + '/settings.json', (data) => {
                if (!data) {
                    return
                }

                let newSettings = JSON.parse(data)
                newSettings.appLocation = state.appLocation

                // update rankingsFile location, for cases where app location is
                // different
                if (newSettings.rankingsFile) {
                    console.log(newSettings, state.appLocation)
                    newSettings.rankingsFile = state.appLocation
                        + '\\localhostFiles\\rankings.'
                        + (newSettings.rankingsHtml ? 'html' : 'txt')
                    console.log(newSettings.rankingsFile)
                }

                writeSettings(newSettings, dispatch)
            })
            return

        } else if (state.players === null) { // initial readLog
            if (state.settings && state.settings.logLocation) {
                readLog(state.settings.logLocation, checkLogData)
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

        const intervalId = setInterval(() => {
            if (state.settings && state.settings.logLocation) {
                readLog(state.settings.logLocation, checkLogData)
            }
        }, READ_LOG_INTERVAL)

        return () => clearInterval(intervalId)
    })

    useEffect(() => {
        // console.log('settings changed')
        if (state.settings && state.settings.logLocation) {
            readLog(state.settings.logLocation, writeNewRankingsFile)
        }
    }, [state.settings])

    const handleSetSettingsView = () => {
        if (state.settings && state.settings.logLocation) {
            readLog(state.settings.logLocation, checkLogData)
        }
    }

    const checkUpdate = () => {
        if (updateCheckNotDone) {
            updateCheckNotDone = false
            return true
        }
        return false
    }

    return <main style={{
        marginTop: '4em',
    }} >
        <Navbar {...{ handleSetSettingsView }} />
        <MainView />
        <UpdateBar
            updateCheckNotDone={checkUpdate()}
            appVersion={appVersion}
        />

    </main>
}

export default App
