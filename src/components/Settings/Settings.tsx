import { useRef, useState } from 'react'

import { Game, GAME_CONFIG } from '../../constants/games'
import { fetchCoh2ProfileId } from '../../functions/api/fetchCoh2ProfileId'
import { updateSettings } from '../../functions/settings/writeSettings'
import useEsc from '../../hooks/useEsc'
import useText from '../../hooks/useText'
import useTimedBoolean from '../../hooks/useTimedBoolean'
import { useSettingsStore } from '../../stores/settingsStore'
import { useSettingsViewStore } from '../../stores/settingsViewStore'
import { FontSize, Language, NavbarPosition, Theme } from '../../types'
import Choice from '../Choice'
import Icon from '../Icon'
import { faTimes } from '../icons'
import Modal from '../Modal/Modal'
import Notification from '../Notification'
import ClearButton from './ClearButton'
import IntervalInput from './IntervalInput'
import SettingsAfterLog from './SettingsAfterLog'
import SettingsDiv from './SettingsDiv'

import styles from './Settings.module.css'

interface Props {
    handleSetSettingsView: () => void
}

function Settings(props: Props) {
    const getText = useText()
    const { settings } = useSettingsStore()
    const { closeSettingsView } = useSettingsViewStore()

    const lg = settings && settings.language ? settings.language : 'en'
    const navbarPosition = settings?.navbarPosition ?? 'top'
    const fontSize = settings?.fontSize ?? 'small'
    const theme = settings?.theme ?? 'dark'

    const handleNavbarPosition = (pos: NavbarPosition) => {
        updateSettings({ navbarPosition: pos })
    }

    const handleFontSize = (size: FontSize) => {
        updateSettings({ fontSize: size })
    }

    const handleTheme = (t: Theme) => {
        updateSettings({ theme: t })
    }

    const [confirm, setConfirm] = useState<{ text?: string; onOk: () => void } | null>(null)

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
            updateSettings({ steamId: undefined, profileIdCoh2: undefined })
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
            updateSettings({ steamId, profileIdCoh2: profileId })
            setTimedSetID(true)
        }
        saveSteamId()
    }

    const clearSteamId = () => {
        updateSettings({ steamId: undefined, profileIdCoh2: undefined })
        if (steamIdInputRef.current) {
            steamIdInputRef.current.value = ''
        }
    }

    const clearLogLocation = (game: Game) => {
        const key = GAME_CONFIG[game].logLocationKey
        updateSettings({ [key]: undefined })
    }

    const resetAllSettings = async () => {
        const settingsPath =
            window.electronAPI.settingsDir + window.electronAPI.pathSep + 'settings.json'
        const blank = JSON.stringify({
            appLocation: window.electronAPI.appLocation,
        })
        await window.electronAPI.settings.write(settingsPath, blank)
        window.location.reload()
    }

    const changeLogLocation = async (game: Game) => {
        const file = await window.electronAPI.dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Logs', extensions: ['log'] },
                { name: 'All Files', extensions: ['*'] },
            ],
        })
        if (file !== undefined && file.filePaths[0]) {
            const key = GAME_CONFIG[game].logLocationKey
            updateSettings({ [key]: file.filePaths[0] })
        }
    }

    const handleLanguage = (lang: Language) => {
        updateSettings({ language: lang })
    }

    const errorDiv = timedError ? (
        <Notification
            testId="steam-id-error"
            style={{
                backgroundColor: 'var(--bg-danger)',
                color: 'var(--spinner-color)',
            }}
            text={getText('id_is_wrong')}
        />
    ) : null

    const savedDiv = timedSetID ? (
        <Notification testId="steam-id-success" text={getText('id_set')} />
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
        <div className={styles.container}>
            <Icon
                fun={handleClose}
                icon={faTimes}
                testId="close-button"
                color="var(--text-on-surface)"
            />
            <SettingsDiv>
                <div style={{ display: 'flex', gap: '2em', flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ fontWeight: 'bold' }} data-testid="language-title">
                            {getText('language')}
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
                                <Choice
                                    key={lang}
                                    type="radio"
                                    testId={`language-select-${lang}`}
                                    name="language"
                                    value={lang}
                                    label={lang.toUpperCase()}
                                    checked={lg === lang}
                                    onChange={() => handleLanguage(lang)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{getText('navbar_position')}</div>
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
                                <Choice
                                    key={pos}
                                    type="radio"
                                    testId={`navbar-position-${pos}`}
                                    name="navbarPosition"
                                    value={pos}
                                    label={getText(`navbar_${pos}`)}
                                    checked={navbarPosition === pos}
                                    onChange={() => handleNavbarPosition(pos)}
                                    className={
                                        pos === 'top'
                                            ? `${styles.positionOption} ${styles.fullRow}`
                                            : styles.positionOption
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{getText('font_size')}</div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.3em',
                                marginTop: '0.3em',
                            }}
                        >
                            {(['small', 'medium', 'large'] as const).map((size) => (
                                <Choice
                                    key={size}
                                    type="radio"
                                    testId={`font-size-${size}`}
                                    name="fontSize"
                                    value={size}
                                    label={getText(`font_${size}`)}
                                    checked={fontSize === size}
                                    onChange={() => handleFontSize(size)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{getText('theme')}</div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.3em',
                                marginTop: '0.3em',
                            }}
                        >
                            {(['dark', 'light'] as const).map((t) => (
                                <Choice
                                    key={t}
                                    type="radio"
                                    testId={`theme-${t}`}
                                    name="theme"
                                    value={t}
                                    label={getText(`theme_${t}`)}
                                    checked={theme === t}
                                    onChange={() => handleTheme(t)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </SettingsDiv>

            <SettingsDiv title={`COH2 ${getText('log_location_title')}`}>
                <div className={styles.textDiv}>
                    {settings?.logLocationCoh2 ? (
                        <span className={styles.textDivText}>{settings.logLocationCoh2}</span>
                    ) : (
                        <span className={styles.placeholder}>{getText('required_for_coh2')}</span>
                    )}
                    {settings?.logLocationCoh2 && (
                        <ClearButton
                            testId="clear-log-coh2-button"
                            onClick={() =>
                                setConfirm({
                                    text: getText('clear_log_location_confirm'),
                                    onOk: () => clearLogLocation('coh2'),
                                })
                            }
                            title={getText('clear_log_location')}
                        />
                    )}
                    {timedCopyCoh2 && (
                        <Notification
                            testId="copy-log-coh2-notification"
                            text={getText('copied')}
                        />
                    )}
                </div>
                <div className={styles.buttonRow}>
                    <button
                        className={styles.button}
                        data-testid="log-location-button-coh2"
                        onClick={() => changeLogLocation('coh2')}
                    >
                        {getText('select')}
                    </button>
                    {settings?.logLocationCoh2 && (
                        <button
                            className={styles.button}
                            data-testid="copy-log-coh2-button"
                            onClick={() => {
                                setTimedCopyCoh2(true)
                                navigator.clipboard.writeText(settings.logLocationCoh2 ?? '')
                            }}
                        >
                            {getText('copy')}
                        </button>
                    )}
                </div>
            </SettingsDiv>

            <SettingsDiv title={`COH3 ${getText('log_location_title')}`}>
                <div className={styles.textDiv}>
                    {settings?.logLocationCoh3 ? (
                        <span className={styles.textDivText}>{settings.logLocationCoh3}</span>
                    ) : (
                        <span className={styles.placeholder}>{getText('required_for_coh3')}</span>
                    )}
                    {settings?.logLocationCoh3 && (
                        <ClearButton
                            testId="clear-log-coh3-button"
                            onClick={() =>
                                setConfirm({
                                    text: getText('clear_log_location_confirm'),
                                    onOk: () => clearLogLocation('coh3'),
                                })
                            }
                            title={getText('clear_log_location')}
                        />
                    )}
                    {timedCopyCoh3 && (
                        <Notification
                            testId="copy-log-coh3-notification"
                            text={getText('copied')}
                        />
                    )}
                </div>
                <div className={styles.buttonRow}>
                    <button
                        className={styles.button}
                        data-testid="log-location-button-coh3"
                        onClick={() => changeLogLocation('coh3')}
                    >
                        {getText('select')}
                    </button>
                    {settings?.logLocationCoh3 && (
                        <button
                            className={styles.button}
                            data-testid="copy-log-coh3-button"
                            onClick={() => {
                                setTimedCopyCoh3(true)
                                navigator.clipboard.writeText(settings.logLocationCoh3 ?? '')
                            }}
                        >
                            {getText('copy')}
                        </button>
                    )}
                </div>
            </SettingsDiv>

            <SettingsDiv title={getText('my_steam_id')}>
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
                                onClick={() =>
                                    setConfirm({
                                        text: getText('clear_steam_id_confirm'),
                                        onOk: clearSteamId,
                                    })
                                }
                                title={getText('clear_steam_id')}
                            />
                        )}
                    </div>

                    <button
                        className={styles.button}
                        data-testid="steam-id-save"
                        onClick={handleSteamId}
                    >
                        {getText('save')}
                    </button>
                    {errorDiv}
                    {savedDiv}
                </>
            </SettingsDiv>

            <IntervalInput />

            <SettingsAfterLog />

            <Modal
                isOpen={confirm !== null}
                onClose={() => setConfirm(null)}
                className={styles.confirmModal}
                overlayClassName={styles.confirmOverlay}
            >
                <p>{confirm?.text}</p>
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
                        data-testid="confirm-ok"
                        onClick={() => {
                            confirm?.onOk()
                            setConfirm(null)
                        }}
                    >
                        {getText('ok')}
                    </button>
                    <button
                        className={styles.button}
                        data-testid="confirm-cancel"
                        onClick={() => setConfirm(null)}
                    >
                        {getText('cancel')}
                    </button>
                </div>
            </Modal>

            <SettingsDiv>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        className={styles.button}
                        data-testid="reset-settings-button"
                        disabled={isDefaultSettings}
                        onClick={() =>
                            setConfirm({
                                text: getText('reset_all_settings_confirm'),
                                onOk: resetAllSettings,
                            })
                        }
                    >
                        {getText('reset_all_settings')}
                    </button>
                </div>
            </SettingsDiv>
        </div>
    )
}

export default Settings
