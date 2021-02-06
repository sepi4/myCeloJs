import React from 'react'
import { useDispatch, useSelector, } from 'react-redux'

import fs from 'fs'
import e from 'electron'
const { dialog } = e.remote

import SettingsInputDiv from './SettingsInputDiv'

function Settings() {

    const dispatch = useDispatch()
    const state = useSelector(state => state)

    const handleLogLocation = () => {
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Logs', extensions: ['log'] },
                { name: 'All Files', extensions: ['*'] },
            ],
        }).then(function (file) {
            if (file !== undefined && file.filePaths[0]) {
                const newSettings = {
                    ...state.settings,
                    logLocation: file.filePaths[0],
                }
                fs.writeFile(
                    './settings.json',
                    JSON.stringify(newSettings, null, 4),
                    'utf-8',
                    // (err, data) => {
                    () => {
                        dispatch({
                            type: 'SET_SETTINGS',
                            data: newSettings,
                        })
                    },
                )
            }
        })
    }

    const handleRankingFileLocation = () => {
        dialog.showSaveDialog({
            filters: [{
                name: 'txt',
                extensions: ['txt']
            }]
        }).then((obj) => {
            if (obj !== undefined && obj.filePath) {
                const newSettings = {
                    ...state.settings,
                    rankingFileLocation: obj.filePath,
                }
                fs.writeFile(
                    './settings.json',
                    JSON.stringify(newSettings, null, 4),
                    'utf-8',
                    () => {
                        dispatch({
                            type: 'SET_SETTINGS',
                            data: newSettings,
                        })
                    },
                )
            }
        })
    }

    return <div style={{ marginTop: '4em' }}>
        <SettingsInputDiv
            text="Log location:"
            settingsKey="logLocation"
            clickFun={handleLogLocation}
        />
        <SettingsInputDiv
            text="Ranking file location (for OBS):"
            settingsKey="rankingFileLocation"
            clickFun={handleRankingFileLocation}
        />
    </div>

}

export default Settings