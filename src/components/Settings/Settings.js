import React, { useState } from 'react'
import { useDispatch, useSelector, } from 'react-redux'

import electron from 'electron'

const { dialog, clipboard } = electron.remote

import SettingsDiv from './SettingsDiv'
import RadioButton from './RadioButton'
import RadioButtonsDiv from './RadioButtonsDiv'

import writeSettings from '../../functions/writeSettings'

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
                writeSettings(newSettings, dispatch)
            }
        })
    }

    const handleRankingsType = (e) => {
        // console.log(e.target.value)
        const newFormat = e.target.value
        const loc = process.cwd() + '\\localhostFiles\\rankings.' + newFormat
        const newSettings = {
            ...settings,
            rankingsHtml: newFormat === 'html',
            rankingsFile: loc,
        }
        writeSettings(newSettings, dispatch)
    }

    const handleRankingsOrientation = (e) => {
        const newOriantation = e.target.value
        const newSettings = {
            ...settings,
            rankingsHorizontal: newOriantation === 'horizontal',
        }
        writeSettings(newSettings, dispatch)
    }

    const copyRankingsFileLocation = () => {
        if (settings.rankingsFile) {
            clipboard.writeText(settings.rankingsFile)
            setCopied(true)
            setTimeout(() => setCopied(false), 500)
        }     
    }

    const fileTypeSet = settings && settings.rankingsFile
        && settings.rankingsHorizontal !== undefined
        && settings.rankingsHtml !== undefined

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

        {settings && settings.logLocation ?
            <>
                <SettingsDiv
                    title="Rankings file (for OBS-studio):"
                    handler={copyRankingsFileLocation}
                    buttonText={fileTypeSet ? 'Copy' : null }
                >

                    <RadioButtonsDiv title='Type:' >
                        <RadioButton
                            checked={settings.rankingsHtml !== undefined
                                && settings.rankingsHtml}
                            handler={handleRankingsType}
                            labelText={'html'}
                        />
                        <RadioButton
                            checked={settings.rankingsHtml !== undefined
                                && !settings.rankingsHtml}
                            handler={handleRankingsType}
                            labelText={'txt'}
                        />
                    </RadioButtonsDiv>


                    <RadioButtonsDiv title='Oriantation:' >
                        <RadioButton
                            checked={settings.rankingsHorizontal !== undefined 
                                && settings.rankingsHorizontal}
                            handler={handleRankingsOrientation}
                            labelText={'horizontal'}
                        />
                        <RadioButton
                            checked={settings.rankingsHorizontal !== undefined 
                                && !settings.rankingsHorizontal}
                            handler={handleRankingsOrientation}
                            labelText={'vertical'}
                        />
                    </RadioButtonsDiv>

                    {fileTypeSet 
                        && (
                            < div style={{ overflowWrap: 'break-word' }}>
                                {settings.rankingsFile}
                            </div>
                        )
                    }

                    {copied
                        ? <span style={{
                            backgroundColor: 'darkred',
                            color: '#ddd',
                            marginLeft: '.5em',
                            padding: '.2em',
                            borderRadius: '.5em',
                        }}>copied</span>
                        : null
                    }
                </SettingsDiv>

            </>

            : <SettingsDiv title="Rankings file type (OBS-studio):">
                <p style={{ color: 'darkred' }}>Add log location file first</p>
            </SettingsDiv>
        }

    </div>

}

export default Settings