import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from 'react'

import { fetchCoh2ProfileId } from '../../functions/api/fetchCoh2ProfileId'
import writeSettings from '../../functions/settings/writeSettings'
import getText from '../../functions/utils/getText'
import useEsc from '../../hooks/useEsc'
import useTimedBoolean from '../../hooks/useTimedBoolean'
import { useSettingsStore } from '../../stores/settingsStore'
import { useSettingsViewStore } from '../../stores/settingsViewStore'
import { Language, SettingsType } from '../../types'
import Icon from '../Icon'
import Modal from '../Modal/Modal'
import Notification from '../Notification'
import ClearButton from './ClearButton'
import styles from './Settings.module.css'
import SettingsAfterLog from './SettingsAfterLog'
import SettingsDiv from './SettingsDiv'

interface Props {
    handleSetSettingsView: () => void
}

function Settings(props: Props) {
    const { settings } = useSettingsStore()
    const { closeSettingsView } = useSettingsViewStore()

    const lg = settings && settings.language ? settings.language : 'en'
    const sidebarPosition = settings?.sidebarPosition ?? 'left'

    const handleSidebarPosition = (pos: 'left' | 'right' | 'top') => {
        writeSettings({ ...settings!, sidebarPosition: pos })
    }

    const [resetConfirmOpen, setResetConfirmOpen] = useState(false)

    const [timedError, setTimedError] = useTimedBoolean(1000)
    const [timedSetID, setTimedSetID] = useTimedBoolean(1000)
    const [timedCopyCoh2, setTimedCopyCoh2] = useTimedBoolean(1000)
    const [timedCopyCoh3, setTimedCopyCoh3] = useTimedBoolean(1000)
    const steamIdInputRef = useRef<HTMLInputElement>(null)

    const handleClose = () => {
        closeSettingsView()
        props.handleSetSettingsView()
    }

    useEsc(handleClose)

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

        const steamId = num
        async function saveSteamId() {
            const profileId = await fetchCoh2ProfileId(steamId)
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
        }
        saveSteamId()
    }

    const clearSteamId = () => {
        const newSettings = {
            ...settings,
            steamId: undefined,
            profileIdCoh2: undefined,
        } as unknown as SettingsType
        writeSettings(newSettings)
        if (steamIdInputRef.current) {
            steamIdInputRef.current.value = ''
        }
    }

    const clearLogLocation = (game: 'coh2' | 'coh3') => {
        const key = game === 'coh2' ? 'logLocationCoh2' : 'logLocationCoh3'
        writeSettings({ ...settings!, [key]: undefined })
    }

    const changeLogLocation = async (game: 'coh2' | 'coh3') => {
        const file = await window.electronAPI.dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Logs', extensions: ['log'] },
                { name: 'All Files', extensions: ['*'] },
            ],
        })
        if (file !== undefined && file.filePaths[0]) {
            const key = game === 'coh2' ? 'logLocationCoh2' : 'logLocationCoh3'
            const newSettings = {
                ...settings,
                [key]: file.filePaths[0],
            } as SettingsType
            writeSettings(newSettings)
        }
    }

    const handleLanguage = (lang: Language) => {
        writeSettings({ ...settings!, language: lang })
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

    const isDefaultSettings =
        !settings ||
        (!settings.logLocationCoh2 &&
            !settings.logLocationCoh3 &&
            !settings.language &&
            !settings.steamId &&
            !settings.rankingsPort &&
            !settings.ignoreUntil)

    return (
        <div>
            <Icon fun={handleClose} icon={faTimes} testId="close-button" color="#222" />
            <SettingsDiv>
                <div style={{ display: 'flex', gap: '2em', flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ fontWeight: 'bold' }} data-testid="language-title">
                            {getText('language', settings)}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.3em',
                                marginTop: '0.3em',
                            }}
                        >
                            {(['en', 'ru'] as const).map((lang) => (
                                <label
                                    key={lang}
                                    style={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <input
                                        data-testid={`language-select-${lang}`}
                                        type="radio"
                                        name="language"
                                        value={lang}
                                        checked={lg === lang}
                                        onChange={() => handleLanguage(lang)}
                                        style={{ marginRight: '0.4em', accentColor: '#111' }}
                                    />
                                    {lang.toUpperCase()}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>
                            {getText('sidebar_position', settings)}
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '0.3em',
                                marginTop: '0.3em',
                                width: '10em',
                            }}
                        >
                            {(['top', 'left', 'right'] as const).map((pos) => (
                                <label
                                    key={pos}
                                    style={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        ...(pos === 'top' ? { gridColumn: '1 / -1' } : {}),
                                    }}
                                >
                                    <input
                                        data-testid={`sidebar-position-${pos}`}
                                        type="radio"
                                        name="sidebarPosition"
                                        value={pos}
                                        checked={sidebarPosition === pos}
                                        onChange={() => handleSidebarPosition(pos)}
                                        style={{ marginRight: '0.4em', accentColor: '#111' }}
                                    />
                                    {getText(`sidebar_${pos}`, settings)}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </SettingsDiv>

            <SettingsDiv
                title={`COH2 ${getText('log_location_title', settings)}`}
                required
                requiredTitle={getText('required_for_coh2', settings)}
            >
                <div className={styles.textDiv}>
                    <span className={styles.textDivText}>{settings?.logLocationCoh2 ?? ''}</span>
                    {settings?.logLocationCoh2 && (
                        <ClearButton
                            testId="clear-log-coh2-button"
                            onClick={() => clearLogLocation('coh2')}
                            title={getText('clear_log_location', settings)}
                        />
                    )}
                    {timedCopyCoh2 && (
                        <Notification
                            testId="copy-log-coh2-notification"
                            text={getText('copied', settings)}
                        />
                    )}
                </div>
                <div className={styles.buttonRow}>
                    <button
                        className={styles.button}
                        data-testid="log-location-button-coh2"
                        onClick={() => changeLogLocation('coh2')}
                    >
                        {getText('select', settings)}
                    </button>
                    {settings?.logLocationCoh2 && (
                        <button
                            className={styles.button}
                            data-testid="copy-log-coh2-button"
                            onClick={() => {
                                setTimedCopyCoh2(true)
                                navigator.clipboard.writeText(settings.logLocationCoh2!)
                            }}
                        >
                            {getText('copy', settings)}
                        </button>
                    )}
                </div>
            </SettingsDiv>

            <SettingsDiv
                title={`COH3 ${getText('log_location_title', settings)}`}
                required
                requiredTitle={getText('required_for_coh3', settings)}
            >
                <div className={styles.textDiv}>
                    <span className={styles.textDivText}>{settings?.logLocationCoh3 ?? ''}</span>
                    {settings?.logLocationCoh3 && (
                        <ClearButton
                            testId="clear-log-coh3-button"
                            onClick={() => clearLogLocation('coh3')}
                            title={getText('clear_log_location', settings)}
                        />
                    )}
                    {timedCopyCoh3 && (
                        <Notification
                            testId="copy-log-coh3-notification"
                            text={getText('copied', settings)}
                        />
                    )}
                </div>
                <div className={styles.buttonRow}>
                    <button
                        className={styles.button}
                        data-testid="log-location-button-coh3"
                        onClick={() => changeLogLocation('coh3')}
                    >
                        {getText('select', settings)}
                    </button>
                    {settings?.logLocationCoh3 && (
                        <button
                            className={styles.button}
                            data-testid="copy-log-coh3-button"
                            onClick={() => {
                                setTimedCopyCoh3(true)
                                navigator.clipboard.writeText(settings.logLocationCoh3!)
                            }}
                        >
                            {getText('copy', settings)}
                        </button>
                    )}
                </div>
            </SettingsDiv>

            <SettingsDiv title={getText('my_steam_id', settings)}>
                <>
                    <div className={styles.inputWrapper}>
                        <input
                            data-testid="steam-id-input"
                            className={styles.input}
                            ref={steamIdInputRef}
                            defaultValue={settings && settings.steamId ? settings.steamId : ''}
                        />
                        {settings?.steamId && (
                            <ClearButton
                                testId="clear-steam-id-button"
                                onClick={clearSteamId}
                                title={getText('clear_steam_id', settings)}
                            />
                        )}
                    </div>

                    <button
                        className={styles.button}
                        data-testid="steam-id-save"
                        onClick={handleSteamId}
                    >
                        {getText('save', settings)}
                    </button>
                    {errorDiv}
                    {savedDiv}
                </>
            </SettingsDiv>

            <SettingsAfterLog />

            <Modal
                isOpen={resetConfirmOpen}
                onClose={() => setResetConfirmOpen(false)}
                className={styles.resetConfirmModal}
                overlayClassName={styles.resetConfirmOverlay}
            >
                <p>{getText('reset_all_settings_confirm', settings)}</p>
                <div
                    style={{
                        display: 'flex',
                        gap: '1em',
                        justifyContent: 'center',
                        marginTop: '1em',
                    }}
                >
                    <button
                        className={styles.button}
                        data-testid="reset-confirm-ok"
                        onClick={() => {
                            setResetConfirmOpen(false)
                            const settingsPath =
                                window.electronAPI.settingsDir +
                                window.electronAPI.pathSep +
                                'settings.json'
                            const blank = JSON.stringify({
                                appLocation: window.electronAPI.appLocation,
                            })
                            async function resetAndReload() {
                                await window.electronAPI.settings.write(settingsPath, blank)
                                window.location.reload()
                            }
                            resetAndReload()
                        }}
                    >
                        {getText('ok', settings)}
                    </button>
                    <button
                        className={styles.button}
                        data-testid="reset-confirm-cancel"
                        onClick={() => setResetConfirmOpen(false)}
                    >
                        {getText('cancel', settings)}
                    </button>
                </div>
            </Modal>

            <SettingsDiv>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        className={styles.button}
                        data-testid="reset-settings-button"
                        disabled={isDefaultSettings}
                        onClick={() => setResetConfirmOpen(true)}
                    >
                        {getText('reset_all_settings', settings)}
                    </button>
                </div>
            </SettingsDiv>
        </div>
    )
}

export default Settings
