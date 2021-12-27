import React, { useRef } from 'react'

import axios from 'axios'
import electron from 'electron'

const { dialog } = electron.remote

import SettingsDiv from './SettingsDiv'
import SettingsAfterLog from './SettingsAfterLog'
import Notification from '../Notification'

import useTimedBoolean from '../../hooks/useTimedBoolean'

import writeSettings from '../../functions/writeSettings'

import { StyledButton } from '../styled/styledSettings'
import styles from './Settings.module.css'

import getText from '../../functions/getText'
import useEsc from '../../hooks/useEsc'
import { useAppDispatch, useAppSelector } from '../../hooks/customReduxHooks'
import { SearchResult } from '../../types'

interface Props {
    handleSetSettingsView: () => void
}

function Settings(props: Props) {
    const dispatch = useAppDispatch()
    const state = useAppSelector((state) => state)
    const settings = state.settings

    const lg = settings && settings.language ? settings.language : 'en'
    const siteLink = settings ? settings.siteLink : 'coh2stats.com'

    const [timedError, setTimedError] = useTimedBoolean(1000)
    const [timedSetID, setTimedSetID] = useTimedBoolean(1000)
    const steamIdInputRef = useRef<HTMLInputElement>(null)

    const settingsViewToggeler = () => {
        dispatch({ type: 'TOGGLE_SETTINGS_VIEW' })
        props.handleSetSettingsView()
    }

    useEsc(settingsViewToggeler)

    const setError = () => {
        setTimedError(true)
        if (steamIdInputRef.current) {
            steamIdInputRef.current.value = settings.steamId
                ? settings.steamId
                : ''
        }
    }

    const handleSteamId = () => {
        const num = steamIdInputRef.current?.value.trim()
        if (num === '') {
            const newSettings = {
                ...settings,
                steamId: undefined,
                profileId: undefined,
            }
            writeSettings(newSettings, dispatch)
            setTimedSetID(true)
            return
        }

        // check that steam id is 17 long digit
        if (!num?.match(/^\d{17}$/)) {
            setError()
            return
        }

        const url =
            'https://coh2-api.reliclink.com/community/' +
            'leaderboard/GetPersonalStat?title=coh2&profile_names=[' +
            '%22%2Fsteam%2F' +
            num +
            '%22]'

        axios
            .get(url)
            .then((res: SearchResult) => {
                try {
                    if (
                        res.status === 200 &&
                        res.data.result.message === 'SUCCESS'
                    ) {
                        const group = res.data.statGroups.find(
                            (g) => g.type === 1
                        )
                        if (!group) {
                            return
                        }

                        const profile = group.members[0]

                        const newSettings = {
                            ...settings,
                            steamId: num,
                            profileId: profile.profile_id,
                        }
                        writeSettings(newSettings, dispatch)
                        setTimedSetID(true)
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
        dialog
            .showOpenDialog({
                properties: ['openFile'],
                filters: [
                    { name: 'Logs', extensions: ['log'] },
                    { name: 'All Files', extensions: ['*'] },
                ],
            })
            .then(function (file) {
                if (file !== undefined && file.filePaths[0]) {
                    const newSettings = {
                        ...settings,
                        logLocation: file.filePaths[0],
                    }
                    writeSettings(newSettings, dispatch)
                }
            })
    }

    const handleLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSettings = {
            ...settings,
            language: e.target.value,
        }
        writeSettings(newSettings, dispatch)
    }

    const handleSiteLink = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSettings = {
            ...settings,
            siteLink: e.target.value,
        }
        writeSettings(newSettings, dispatch)
    }

    const star = <span className={styles.star}>*</span>

    const req = (
        <div className={styles.req}>
            {star} {getText('required', settings)}
        </div>
    )

    const errorDiv = timedError ? (
        <Notification
            style={{
                backgroundColor: 'darkred',
                color: 'white',
            }}
            text={getText('id_is_wrong', settings)}
        />
    ) : null

    const savedDiv = timedSetID ? (
        <Notification text={getText('id_set', settings)} />
    ) : null

    return (
        <div style={{ marginTop: '4em' }}>
            {req}

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

            <SettingsDiv
                title={getText('log_location_title', settings)}
                required
            >
                <div className={styles.textDiv}>
                    {settings && settings.logLocation
                        ? settings.logLocation
                        : ''}
                </div>
                <StyledButton onClick={changeLogLocation}>
                    {getText('select', settings)}
                </StyledButton>
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
                <>
                    <input
                        className={styles.input}
                        ref={steamIdInputRef}
                        defaultValue={
                            settings && settings.steamId ? settings.steamId : ''
                        }
                    />

                    <StyledButton onClick={handleSteamId}>
                        {getText('save', settings)}
                    </StyledButton>
                    {errorDiv}
                    {savedDiv}
                </>
            </SettingsDiv>

            <SettingsAfterLog />
        </div>
    )
}

export default Settings
