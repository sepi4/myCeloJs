import { useRef, useState } from 'react'

import { fetchCoh2ProfileId } from '../../functions/api/fetchCoh2ProfileId'
import { updateSettings } from '../../functions/settings/writeSettings'
import useEsc from '../../hooks/useEsc'
import useLanguage from '../../hooks/useLanguage'
import useNavbarPosition from '../../hooks/useNavbarPosition'
import useText from '../../hooks/useText'
import useTimedBoolean from '../../hooks/useTimedBoolean'
import { useSettingsStore } from '../../stores/settingsStore'
import { useSettingsViewStore } from '../../stores/settingsViewStore'
import Icon from '../Icon'
import { faTimes } from '../icons'
import Modal from '../Modal/Modal'
import Notification from '../Notification'
import ClearButton from './ClearButton'
import IntervalInput from './IntervalInput'
import LogLocationSetting from './LogLocationSetting'
import RadioGroup from './RadioGroup'
import SettingsAfterLog from './SettingsAfterLog'
import SettingsSection from './SettingsSection'

import styles from './Settings.module.css'

interface Props {
    handleSetSettingsView: () => void
}

function Settings(props: Props) {
    const getText = useText()
    const { settings } = useSettingsStore()
    const { closeSettingsView } = useSettingsViewStore()

    const language = useLanguage()
    const navbarPosition = useNavbarPosition()
    const fontSize = settings?.fontSize ?? 'small'
    const theme = settings?.theme ?? 'dark'

    const [confirm, setConfirm] = useState<{ text?: string; onOk: () => void } | null>(null)

    const [timedError, setTimedError] = useTimedBoolean(1000)
    const [timedSetID, setTimedSetID] = useTimedBoolean(1000)
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

    const removeSteamId = () => {
        updateSettings({ steamId: undefined, profileIdCoh2: undefined })
    }

    const handleSteamId = () => {
        const num = steamIdInputRef.current?.value.trim()
        if (num === '') {
            removeSteamId()
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
        removeSteamId()
        if (steamIdInputRef.current) {
            steamIdInputRef.current.value = ''
        }
    }

    const askConfirm = (text: string, onOk: () => void) => {
        setConfirm({ text, onOk })
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
                onClick={handleClose}
                icon={faTimes}
                testId="close-button"
                color="var(--text-on-surface)"
            />
            <SettingsSection>
                <div className={styles.radioGroups}>
                    <RadioGroup
                        title={getText('language')}
                        titleTestId="language-title"
                        name="language"
                        testIdPrefix="language-select"
                        options={['en', 'ru'] as const}
                        selected={language}
                        getLabel={(lang) => lang.toUpperCase()}
                        onChange={(lang) => updateSettings({ language: lang })}
                    />
                    <RadioGroup
                        title={getText('navbar_position')}
                        name="navbarPosition"
                        testIdPrefix="navbar-position"
                        options={['top', 'left', 'right'] as const}
                        selected={navbarPosition}
                        getLabel={(pos) => getText(`navbar_${pos}`)}
                        onChange={(pos) => updateSettings({ navbarPosition: pos })}
                        optionsClassName={styles.positionOptions}
                    />
                    <RadioGroup
                        title={getText('font_size')}
                        name="fontSize"
                        testIdPrefix="font-size"
                        options={['small', 'medium', 'large'] as const}
                        selected={fontSize}
                        getLabel={(size) => getText(`font_${size}`)}
                        onChange={(size) => updateSettings({ fontSize: size })}
                    />
                    <RadioGroup
                        title={getText('theme')}
                        name="theme"
                        testIdPrefix="theme"
                        options={['dark', 'light'] as const}
                        selected={theme}
                        getLabel={(t) => getText(`theme_${t}`)}
                        onChange={(t) => updateSettings({ theme: t })}
                    />
                </div>
            </SettingsSection>

            <LogLocationSetting game="coh2" askConfirm={askConfirm} />

            <LogLocationSetting game="coh3" askConfirm={askConfirm} />

            <SettingsSection title={getText('my_steam_id')}>
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
                                    askConfirm(getText('clear_steam_id_confirm'), clearSteamId)
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
            </SettingsSection>

            <IntervalInput />

            <SettingsAfterLog />

            <Modal
                isOpen={confirm !== null}
                onClose={() => setConfirm(null)}
                className={styles.confirmModal}
                overlayClassName={styles.confirmOverlay}
            >
                <p>{confirm?.text}</p>
                <div className={styles.confirmButtons}>
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

            <SettingsSection>
                <div className={styles.resetRow}>
                    <button
                        className={styles.button}
                        data-testid="reset-settings-button"
                        disabled={isDefaultSettings}
                        onClick={() =>
                            askConfirm(getText('reset_all_settings_confirm'), resetAllSettings)
                        }
                    >
                        {getText('reset_all_settings')}
                    </button>
                </div>
            </SettingsSection>
        </div>
    )
}

export default Settings
