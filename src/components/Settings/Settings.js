import React from 'react'
import { useDispatch, useSelector, } from 'react-redux'

import electron from 'electron'
const { dialog, app } = electron.remote

import SettingsDiv from './SettingsDiv'
import RadioButton from './RadioButton'
import RadioButtonsDiv from './RadioButtonsDiv'
import CopyDiv from './CopyDiv'

import writeSettings from '../../functions/writeSettings'

import { StyledTextDiv, StyledButton } from '../styled/styledSettings'

function Settings() {
    const dispatch = useDispatch()
    const settings = useSelector(state => state.settings)
    const state = useSelector(state => state)

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

    const handleType = (e) => {
        const newFormat = e.target.value
        const loc = state.appLocation
            + '\\localhostFiles\\rankings.' + newFormat
        const newSettings = {
            ...settings,
            rankingsHtml: newFormat === 'html',
            rankingsFile: loc,
        }
        writeSettings(newSettings, dispatch)
    }

    const handleOrientation = (e) => {
        const newOriantation = e.target.value
        const newSettings = {
            ...settings,
            rankingsHorizontal: newOriantation === 'horizontal',
        }
        writeSettings(newSettings, dispatch)
    }


    const fileTypeSet = settings
        && settings.rankingsFile
        && settings.rankingsHorizontal !== undefined
        && settings.rankingsHtml !== undefined

    return <div style={{ marginTop: '4em' }}>
        <SettingsDiv title="Log location:" >
            <StyledTextDiv>
                {settings && settings.logLocation
                    ? settings.logLocation
                    : ''
                }
            </StyledTextDiv>
            <StyledButton
                onClick={changeLogLocation}
                buttonColor='black'
            >Select</StyledButton>
        </SettingsDiv>

        {settings && settings.logLocation
            ? <>
                <SettingsDiv title="Rankings file (for OBS-studio):" >
                    <RadioButtonsDiv title='Type:' >
                        <RadioButton
                            checked={settings.rankingsHtml !== undefined
                                && settings.rankingsHtml}
                            handler={handleType}
                            labelText={'html'}
                        />
                        <RadioButton
                            checked={settings.rankingsHtml !== undefined
                                && !settings.rankingsHtml}
                            handler={handleType}
                            labelText={'txt'}
                        />
                    </RadioButtonsDiv>

                    <RadioButtonsDiv title='Orientation:' >
                        <RadioButton
                            checked={settings.rankingsHorizontal !== undefined
                                && settings.rankingsHorizontal}
                            handler={handleOrientation}
                            labelText={'horizontal'}
                        />
                        <RadioButton
                            checked={settings.rankingsHorizontal !== undefined
                                && !settings.rankingsHorizontal}
                            handler={handleOrientation}
                            labelText={'vertical'}
                        />
                    </RadioButtonsDiv>

                    <CopyDiv
                        text={fileTypeSet ? settings.rankingsFile : null}
                    />

                </SettingsDiv>

                {fileTypeSet &&
                    <SettingsDiv title='Settings file location:' >
                        <CopyDiv
                            text={app.getPath('userData') + '\\settings.json'}
                        />
                    </SettingsDiv>
                }

            </>

            : <SettingsDiv title="Rankings file type (OBS-studio):">
                <p style={{ color: 'darkred' }}>Add log location file first</p>
            </SettingsDiv>
        }

    </div>
}

export default Settings