import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector, } from 'react-redux'

import axios from 'axios'
import fs from 'fs'
import electron from 'electron'

// components
import Navbar from './components/Navbar'
import UpdateBar from './components/UpdateBar'
import MainView from './components/MainView'

// functions
import { refactorData } from './functions/refactorData'
import { getPlayersInfo } from './functions/getPlayersInfo'
import { writeRankings } from './functions/writeRankings'
import { readSettings } from './functions/readSettings'
import { guessRankings } from './functions/guessRankings'

let appVersion = electron.remote.app.getVersion()

document.title = 'sepi-celo LADDER BUG VERSION ' + appVersion

let updateCheckNotDone = true
let isReplay = true

// =========== functions ============
// GLOBAL
function getLines(data) {
    let lines = data.split('\n')
    let arr = []
    let stop = false
    let wasGame = false
    let wasNone = false
    isReplay = true

    for (let i = lines.length - 1; i >= 0; i--) {
        const row = lines[i]
        if (row.match('GAME --.* Player:')) {
            wasGame = true
            if (wasGame && wasNone) {
                break
            }
            arr.push(row)
        } else if (row.match('Match Started.*steam.*slot.*ranking')) {
            isReplay = false
            stop = true
            arr.push(row)
        } else if (stop) {
            break
        } else if (wasGame) {
            wasNone = true
        }
    }
    return arr
}

// GLOBAL
function getExtraInfo(players, callback) {

    let ids = players.filter(p => p.profileId != undefined)
        .map(p => p.profileId)

    const url = 'https://coh2-api.reliclink.com/community/'
        + 'leaderboard/GetPersonalStat?title=coh2&profile_ids=['
        + ids.join(',') + ']'

    let leaderboard = undefined
    let cohTitles = undefined

    const fetch1 = axios.get(url)

    const url2 =
        'https://coh2-api.reliclink.com/' +
        'community/leaderboard/GetAvailableLeaderboards?title=coh2'

    const fetch2 = axios.get(url2)

    Promise.all([fetch1, fetch2])
        .then(values => {
            if (values[0].status === 200 && values[1].status === 200) {
                leaderboard = values[0].data
                cohTitles = values[1].data
                let result = refactorData(leaderboard, cohTitles, ids)
                const teams = guessRankings(players, leaderboard, cohTitles)

                callback(result, isReplay, teams)
            }
        })
        .catch(error => {
            console.log(error)
        })
}

// GLOBAL
function readLog(fileLocation, callback) {
    console.log('readLog')
    // console.log('readLog, fileLocation:', fileLocation)
    fileLocation = fileLocation.replace(/\\/, '\\\\')
    fs.readFile(fileLocation, 'utf-8', (err, data) => {
        if (err) {
            console.log('Error in reading logfile: ', err)
        }
        let arr = getLines(data)
        callback(getPlayersInfo(arr))
    })
}

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
            if (state.settings && state.settings.rankingFileLocation) {
                writeRankings(
                    data,
                    state.settings.rankingFileLocation,
                    'checkLogData'
                )
            }
        }
    }

    const writeNewRankingsFile = data => {
        dispatch({
            type: 'SET_EXTRA_INFO',
            data: null,
        })
        if (state.settings && state.settings.rankingFileLocation) {
            writeRankings(
                data,
                state.settings.rankingFileLocation,
                'writeNewRankingsFile'
            )
        }
    }

    useEffect(() => {
        // initial readSettings location of log file
        if (state.settings === null) {
            readSettings('./settings.json', (data) => {
                dispatch({
                    type: 'SET_SETTINGS', 
                    data: JSON.parse(data),
                })
            })
            return
        // initial readLog
        } else if (state.players === null) {
            if (state.settings && state.settings.logLocation) {
                readLog(state.settings.logLocation, checkLogData)
            }
        } else if (state.extraInfo === null && state.players.length > 0) {
            getExtraInfo(state.players, (data, isReplay, teams) => {
                dispatch({
                    type: 'SET_EXTRA_INFO',
                    data,
                })

                if (isReplay) {
                    let newPlayers = []
                    teams.forEach(team => {
                        team.forEach(player => {
                            newPlayers.push(player)
                        })
                    })

                    dispatch({
                        type: 'SET_PLAYERS',
                        data: newPlayers,
                    })

                    writeRankings(
                        newPlayers,
                        state.settings.rankingFileLocation,
                        'useEffect'
                    )

                }
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
        console.log('settings changed')
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
