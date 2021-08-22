import React, { useRef } from 'react'
import { useDispatch, useSelector, } from 'react-redux'

import electron from 'electron'
const { dialog } = electron.remote

import SettingsDiv from './SettingsDiv'
import SettingsAfterLog from './SettingsAfterLog'

import useTimedBoolean from '../../hooks/useTimedBoolean'

import writeSettings from '../../functions/writeSettings'

import { StyledButton } from '../styled/styledSettings'
import styles from './Settings.module.css'

import getText from '../../functions/getText'
import axios from 'axios'

function Settings() {
    const dispatch = useDispatch()
    const settings = useSelector(state => state.settings)
    const lg = settings && settings.language ? settings.language : 'en'
    const siteLink = settings ? settings.siteLink : 'coh2stats.com'
    // const [error, setError] = useState(false)

    const [timed, setTimed] = useTimedBoolean(1000)
    const steamIdInputRef = useRef(null)

    const setError = () => {
        setTimed(true)
        steamIdInputRef.current.value = settings.steamId
            ? settings.steamId
            : ''
    }

    const handleSteamId = () => {
        const num = steamIdInputRef.current.value.trim()
        if (num === '') {
            const newSettings = {
                ...settings,
                steamId: undefined,
                profileId: undefined,
            }
            writeSettings(newSettings, dispatch)
            return
        }

        // check that steam id is 17 long digit
        if (!num.match(/^\d{17}$/)) {
            // console.error('num:', num)
            setError()
            return
        }

        // 76561198006675368
        const url = 'https://coh2-api.reliclink.com/community/' +
            'leaderboard/GetPersonalStat?title=coh2&profile_names=[' +
            '%22%2Fsteam%2F' + num + '%22]'

        axios.get(url)
            .then((res) => {
                try {
                    if (
                        res.status === 200
                        && res.data.result.message === 'SUCCESS'
                    ) {
                        const group = res.data.statGroups.find(g => g.type === 1)
                        const profile = group.members[0]

                        const newSettings = {
                            ...settings,
                            steamId: num,
                            profileId: profile.profile_id + '',
                        }
                        writeSettings(newSettings, dispatch)
                    } else {
                        console.error('res:', res)
                        setError()
                    }

                } catch (error) {
                    console.error('error:', error)
                    setError()
                }
            })
            .catch((err) => {
                console.error('err:', err)
            })
    }

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

        <SettingsDiv title={getText('web_link', settings)}>
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

        <SettingsDiv title={getText('my_steam_id', settings)}>
            <input
                className={styles.input}
                ref={steamIdInputRef}
                defaultValue={settings && settings.steamId
                    ? settings.steamId
                    : ''
                }
            />

            <StyledButton onClick={handleSteamId} >
                {getText('save', settings)}
            </StyledButton>
            {timed &&
                <span style={{
                    backgroundColor: 'darkred',
                    color: 'white',
                    fontSize: '90%',
                    padding: '.2em',
                }}>
                    id is wrong
                    {/* {getText('integer_error', settings)} */}
                </span>
            }

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
    </div>
}

export default Settings