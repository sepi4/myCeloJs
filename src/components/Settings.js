import React from 'react'
import { useDispatch, useSelector, } from 'react-redux'

import fs from 'fs'
import e from 'electron'

const { dialog, clipboard } = e.remote

import SettingsDiv from './SettingsDiv'

function Settings() {
    const dispatch = useDispatch()
    const settings = useSelector(state => state.settings)

    const changeLogLocation = () => {
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Logs', extensions: ['log'] },
                { name: 'All Files', extensions: ['*'] },
            ],
        }).then(function (file) {
            if (file !== undefined && file.filePaths[0]) {
                const newSettings = {
                    ...settings,
                    logLocation: file.filePaths[0],
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

    const handleRankingsType = () => {
        const newSettings = {
            ...settings,
            rankingsHtml: !settings.rankingsHtml,
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

    const copyRankingsFileLocation = () => {
        if (settings.rankingsHtml) {
            clipboard.writeText(process.cwd() + '\\rankings.html')
        } else {
            clipboard.writeText(process.cwd() + '\\rankings.txt')
        }
    }

    return <div style={{ marginTop: '4em' }}>
        <SettingsDiv
            title="Log location:"
            handler={changeLogLocation}
            buttonText='Select'
        >
            {settings && settings.logLocation
                ? settings.logLocation
                : ''
            }
        </SettingsDiv>

        {settings && settings.logLocation
            ? <SettingsDiv
                title="Rankings file type (OBS-studio):"
                handler={copyRankingsFileLocation}
                buttonText='Copy'
            >

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: '0.2em 0',
                    margin: '0 0 0.2em 0',
                    // backgroundColor: '#777777',
                    fontWeight: '600',
                }}>

                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }} >
                        <input
                            style={{ marginRight: '1em' }}
                            type='checkbox'
                            id='html'
                            checked={settings && settings.rankingsHtml}
                            onChange={handleRankingsType}
                        />
                        <label htmlFor='html'>html</label>
                    </span>

                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }} >
                        <input
                            style={{ marginRight: '1em' }}
                            type='checkbox'
                            id='txt'
                            checked={settings && !settings.rankingsHtml}
                            onChange={handleRankingsType}
                        />
                        <label htmlFor='txt'>txt</label>
                    </span>
                </div>
                <div>
                    {settings && settings.rankingsHtml
                        ? process.cwd() + '\\rankings.html'
                        : process.cwd() + '\\rankings.txt'
                    }
                </div>
            </SettingsDiv>
            : <SettingsDiv
                title="Rankings file type (OBS-studio):"
            >
                <p style={{color: 'red'}}>
                    Add log location file first
                </p>

            </SettingsDiv>
        }

    </div>

}

export default Settings