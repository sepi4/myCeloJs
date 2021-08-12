import React from 'react'
import { useDispatch, useSelector, } from 'react-redux'

import electron from 'electron'
const { dialog } = electron.remote

import SettingsDiv from './SettingsDiv'
import SettingsAfterLog from './SettingsAfterLog'

import writeSettings from '../../functions/writeSettings'

import { StyledButton } from '../styled/styledSettings'
import styles from './Settings.module.css'

import getText from '../../functions/getText'

function Settings() {
    const dispatch = useDispatch()
    const settings = useSelector(state => state.settings)
    const lg = settings && settings.language ? settings.language : 'en'
    const siteLink = settings ? settings.siteLink : 'coh2stats.com'

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

    const handleSiteLink = (e) => {

        const newSettings = {
            ...settings,
            siteLink: e.target.value,
        }
        writeSettings(newSettings, dispatch)
    }

    return <div style={{ marginTop: '4em' }}>

        <SettingsDiv title={getText('language', settings)}>
            <select
                onChange={handleLanguage}
                value={lg}
                style={{
                    padding: '.5em',
                    backgroundColor: '#999',
                }}
            >
                <option value="en">EN</option>
                <option value="ru">RU</option>
            </select>
        </SettingsDiv>

        <SettingsDiv title={getText('log_location_title', settings)} >
            <div className={styles.textDiv}>
                {settings && settings.logLocation
                    ? settings.logLocation
                    : ''
                }
            </div>
            <StyledButton
                onClick={changeLogLocation}
            // buttonColor='#999'
            >{getText('select', settings)}</StyledButton>
        </SettingsDiv>

        <SettingsAfterLog />

        <SettingsDiv title='Site for player links'>
            <select
                onChange={handleSiteLink}
                value={siteLink}
                style={{
                    padding: '.5em',
                    backgroundColor: '#999',
                }}
            >
                <option value="coh2stats.com">coh2stats.com</option>
                <option value="coh2.org">coh2.org</option>
            </select>

        </SettingsDiv>

    </div>
}

export default Settings