import React, { useState } from 'react'
import { useDispatch, useSelector, } from 'react-redux'

import fs from 'fs'
import e from 'electron'

const { dialog, clipboard } = e.remote

import SettingsDiv from './SettingsDiv'
import RadioButton from './RadioButton'

function Settings() {
    const dispatch = useDispatch()
    const settings = useSelector(state => state.settings)
    const [copied, setCopied] = useState(false)

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
            rankingsFile: !settings.rankingsHtml 
                ? process.cwd() + '\\rankings.html'
                : process.cwd() + '\\rankings.txt'
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
        if (settings.rankingsFile) {
            clipboard.writeText(settings.rankingsFile)
            setCopied(true)
            setTimeout(() => setCopied(false), 500)
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
                buttonText={settings && settings.rankingsFile 
                    ? 'Copy'
                    : null
                }
            >


                <form style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',

                    padding: '0.2em 0',
                    margin: '0 0 0.2em 0',
                }}>
                    <RadioButton
                        checked={settings['rankingsHtml'] !== undefined
                            && settings['rankingsHtml']
                        }
                        handler={handleRankingsType}
                        labelText={'html'}
                    />
                    <RadioButton
                        checked={settings['rankingsHtml'] !== undefined
                            && !settings['rankingsHtml']
                        }
                        handler={handleRankingsType}
                        labelText={'txt'}
                    />

                </form>

                {settings.rankingsFile}
                {copied
                    ? <span style={{
                        backgroundColor: 'darkred',
                        color: 'white',
                        marginLeft: '.5em',
                        padding: '.2em',
                        borderRadius: '.5em',
                    }}>copied</span>
                    : null
                }
            </SettingsDiv>

            : <SettingsDiv
                title="Rankings file type (OBS-studio):"
            >
                <p style={{ color: 'darkred' }}>Add log location file first</p>
            </SettingsDiv>
        }

    </div>

}

export default Settings