import React from 'react'
import { useDispatch, useSelector, } from 'react-redux'

import electron from 'electron'
const { dialog } = electron.remote

import SettingsDiv from './SettingsDiv'
import SettingsAfterLog from './SettingsAfterLog'

import writeSettings from '../../functions/writeSettings'

import { StyledTextDiv, StyledButton } from '../styled/styledSettings'
import getText from '../../functions/getText'

function Settings() {
    const dispatch = useDispatch()
    const settings = useSelector(state => state.settings)
    const lg = settings ? settings.language : 'en'

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

    const handleLanguage = (e) => {
        const newSettings = {
            ...settings,
            language: e.target.value,
        }
        writeSettings(newSettings, dispatch)
    }


    return <div style={{ marginTop: '4em' }}>

        <SettingsDiv title={getText('language', lg)}>
            <select onChange={handleLanguage} value={lg}>
                <option value="en">EN</option>
                <option value="ru">RU</option>
            </select>
        </SettingsDiv>


        <SettingsDiv title={getText('log_location_title', lg)} >
            <StyledTextDiv>
                {settings && settings.logLocation
                    ? settings.logLocation
                    : ''
                }
            </StyledTextDiv>
            <StyledButton
                onClick={changeLogLocation}
                buttonColor='black'
            >{getText('select', lg)}</StyledButton>
        </SettingsDiv>

        <SettingsAfterLog />

    </div>
}

export default Settings