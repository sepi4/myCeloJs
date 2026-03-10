import React, { useRef } from 'react'

import { fetchCoh2ProfileId } from '../../functions/fetchCoh2ProfileId'
import getText from '../../functions/getText'
import writeSettings from '../../functions/writeSettings'
import useEsc from '../../hooks/useEsc'
import useTimedBoolean from '../../hooks/useTimedBoolean'
import { useSettingsStore } from '../../stores/settingsStore'
import { useSettingsViewStore } from '../../stores/settingsViewStore'
import { SettingsType } from '../../types'
import Notification from '../Notification'
import { StyledButton } from '../styled/styledSettings'
import styles from './Settings.module.css'
import SettingsAfterLog from './SettingsAfterLog'
import SettingsDiv from './SettingsDiv'

interface Props {
    handleSetSettingsView: () => void
}

function Settings(props: Props) {
    const { settings } = useSettingsStore()
    const { toggleSettingsView } = useSettingsViewStore()

    const lg = settings && settings.language ? settings.language : 'en'

    const [timedError, setTimedError] = useTimedBoolean(1000)
    const [timedSetID, setTimedSetID] = useTimedBoolean(1000)
    const [timedCopyCoh2, setTimedCopyCoh2] = useTimedBoolean(1000)
    const [timedCopyCoh3, setTimedCopyCoh3] = useTimedBoolean(1000)
    const steamIdInputRef = useRef<HTMLInputElement>(null)

    const settingsViewToggeler = () => {
        toggleSettingsView()
        props.handleSetSettingsView()
    }

    useEsc(settingsViewToggeler)

    const setError = () => {
        setTimedError(true)
        if (steamIdInputRef.current && settings) {
            steamIdInputRef.current.value = settings.steamId ? settings.steamId : ''
        }
    }

    const handleSteamId = () => {
        const num = steamIdInputRef.current?.value.trim()
        if (num === '') {
            const newSettings = {
                ...settings,
                steamId: undefined,
                profileIdCoh2: undefined,
            } as unknown as SettingsType
            writeSettings(newSettings)
            setTimedSetID(true)
            return
        }

        // check that steam id is 17 long digit
        if (!num?.match(/^\d{17}$/)) {
            setError()
            return
        }

        fetchCoh2ProfileId(num).then((profileId) => {
            if (!profileId) {
                setError()
                return
            }
            writeSettings({
                ...settings,
                steamId: num,
                profileIdCoh2: profileId,
            } as SettingsType)
            setTimedSetID(true)
        })
    }

    const changeLogLocation = (game: 'coh2' | 'coh3') => {
        window.electronAPI.dialog
            .showOpenDialog({
                properties: ['openFile'],
                filters: [
                    { name: 'Logs', extensions: ['log'] },
                    { name: 'All Files', extensions: ['*'] },
                ],
            })
            .then(function (file) {
                if (file !== undefined && file.filePaths[0]) {
                    const key = game === 'coh2' ? 'logLocationCoh2' : 'logLocationCoh3'
                    const newSettings = {
                        ...settings,
                        [key]: file.filePaths[0],
                    } as SettingsType
                    writeSettings(newSettings)
                }
            })
    }

    const handleLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSettings = {
            ...settings,
            language: e.target.value,
        } as SettingsType
        writeSettings(newSettings)
    }

    const errorDiv = timedError ? (
        <Notification
            testId="steam-id-error"
            style={{
                backgroundColor: 'darkred',
                color: 'white',
            }}
            text={getText('id_is_wrong', settings)}
        />
    ) : null

    const savedDiv = timedSetID ? (
        <Notification testId="steam-id-success" text={getText('id_set', settings)} />
    ) : null

    return (
        <div style={{ marginTop: '4em' }}>
            <SettingsDiv title={getText('language', settings)} testId="language-title">
                <select
                    data-testid="language-select"
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

            <SettingsDiv title={`COH2 ${getText('log_location_title', settings)}`} required>
                <div className={styles.textDiv}>
                    {settings?.logLocationCoh2 ?? ''}
                    {timedCopyCoh2 && (
                        <Notification
                            testId="copy-log-coh2-notification"
                            text={getText('copied', settings)}
                        />
                    )}
                </div>
                <div className={styles.buttonRow}>
                    <StyledButton
                        data-testid="log-location-button-coh2"
                        onClick={() => changeLogLocation('coh2')}
                    >
                        {getText('select', settings)}
                    </StyledButton>
                    {settings?.logLocationCoh2 && (
                        <StyledButton
                            data-testid="copy-log-coh2-button"
                            onClick={() => {
                                setTimedCopyCoh2(true)
                                navigator.clipboard.writeText(settings.logLocationCoh2!)
                            }}
                        >
                            {getText('copy', settings)}
                        </StyledButton>
                    )}
                </div>
            </SettingsDiv>

            <SettingsDiv title={`COH3 ${getText('log_location_title', settings)}`} required>
                <div className={styles.textDiv}>
                    {settings?.logLocationCoh3 ?? ''}
                    {timedCopyCoh3 && (
                        <Notification
                            testId="copy-log-coh3-notification"
                            text={getText('copied', settings)}
                        />
                    )}
                </div>
                <div className={styles.buttonRow}>
                    <StyledButton
                        data-testid="log-location-button-coh3"
                        onClick={() => changeLogLocation('coh3')}
                    >
                        {getText('select', settings)}
                    </StyledButton>
                    {settings?.logLocationCoh3 && (
                        <StyledButton
                            data-testid="copy-log-coh3-button"
                            onClick={() => {
                                setTimedCopyCoh3(true)
                                navigator.clipboard.writeText(settings.logLocationCoh3!)
                            }}
                        >
                            {getText('copy', settings)}
                        </StyledButton>
                    )}
                </div>
            </SettingsDiv>

            <SettingsDiv title={getText('my_steam_id', settings)}>
                <>
                    <input
                        data-testid="steam-id-input"
                        className={styles.input}
                        ref={steamIdInputRef}
                        defaultValue={settings && settings.steamId ? settings.steamId : ''}
                    />

                    <StyledButton data-testid="steam-id-save" onClick={handleSteamId}>
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
