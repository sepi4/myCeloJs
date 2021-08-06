import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import writeSettings from '../../functions/writeSettings'

import SettingsDiv from './SettingsDiv'
import RadioButton from './RadioButton'
import RadioButtonsDiv from './RadioButtonsDiv'
import CopyDiv from './CopyDiv'
import SettingsLocation from './SettingsLocation'

export default function SettingsAfterLog() {
    const state = useSelector(state => state)
    const { settings } = state
    const dispatch = useDispatch()

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

    const handleLanguage = (e) => {
        const newSettings = {
            ...settings,
            language: e.target.value,
        }
        writeSettings(newSettings, dispatch)
    }

    const fileTypeSet = settings
        && settings.rankingsFile
        && settings.rankingsHorizontal !== undefined
        && settings.rankingsHtml !== undefined

    if (settings && settings.logLocation) {
        return <>
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

            <SettingsLocation fileTypeSet={fileTypeSet} />


            <SettingsDiv title='Language'>
                <select onChange={handleLanguage}>
                    <option value="en">EN</option>
                    <option value="ru">RU</option>
                </select>

            </SettingsDiv>
        </>
    }

    // if log-file not set
    return (
        <SettingsDiv title="Rankings file type (OBS-studio):">
            <p style={{ color: 'darkred' }}>Add log location file first</p>
        </SettingsDiv>
    )
}