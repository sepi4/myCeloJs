import React from 'react'
import { useDispatch, useSelector, } from 'react-redux'

import electron from 'electron'
const { dialog } = electron.remote

import SettingsDiv from './SettingsDiv'
import SettingsAfterLog from './SettingsAfterLog'

import writeSettings from '../../functions/writeSettings'

import { StyledTextDiv, StyledButton } from '../styled/styledSettings'

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
                writeSettings(newSettings, dispatch)
            }
        })
    }
    console.log('settings:', settings)

    const text = {
        en: 'Select',
        ru: 'Выбрать',
    }

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
            >{text[settings.language]}</StyledButton>
            {/* >Select</StyledButton> */}
        </SettingsDiv>

        <SettingsAfterLog />

    </div>
}

export default Settings