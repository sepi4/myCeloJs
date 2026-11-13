import { Game, GAME_CONFIG } from '../../constants/games'
import { updateSettings } from '../../functions/settings/writeSettings'
import useText from '../../hooks/useText'
import useTimedBoolean from '../../hooks/useTimedBoolean'
import { useSettingsStore } from '../../stores/settingsStore'
import Notification from '../Notification'
import ClearButton from './ClearButton'
import SettingsSection from './SettingsSection'

import styles from './Settings.module.css'

interface Props {
    game: Game
    askConfirm: (text: string, onOk: () => void) => void
}

function LogLocationSetting({ game, askConfirm }: Props) {
    const getText = useText()
    const { settings } = useSettingsStore()
    const [timedCopy, setTimedCopy] = useTimedBoolean(1000)

    const key = GAME_CONFIG[game].logLocationKey
    const logLocation = settings?.[key]

    const selectLogLocation = async () => {
        const file = await window.electronAPI.dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Logs', extensions: ['log'] },
                { name: 'All Files', extensions: ['*'] },
            ],
        })
        if (file !== undefined && file.filePaths[0]) {
            updateSettings({ [key]: file.filePaths[0] })
        }
    }

    const clearLogLocation = () => {
        updateSettings({ [key]: undefined })
    }

    const copyLogLocation = (location: string) => {
        setTimedCopy(true)
        navigator.clipboard.writeText(location)
    }

    return (
        <SettingsSection title={`${game.toUpperCase()} ${getText('log_location_title')}`}>
            <div className={styles.textDiv}>
                {logLocation ? (
                    <span className={styles.textDivText}>{logLocation}</span>
                ) : (
                    <span className={styles.placeholder}>{getText(`required_for_${game}`)}</span>
                )}
                {logLocation && (
                    <ClearButton
                        testId={`clear-log-${game}-button`}
                        onClick={() =>
                            askConfirm(getText('clear_log_location_confirm'), clearLogLocation)
                        }
                        title={getText('clear_log_location')}
                    />
                )}
                {timedCopy && (
                    <Notification
                        testId={`copy-log-${game}-notification`}
                        text={getText('copied')}
                    />
                )}
            </div>
            <div className={styles.buttonRow}>
                <button
                    className={styles.button}
                    data-testid={`log-location-button-${game}`}
                    onClick={selectLogLocation}
                >
                    {getText('select')}
                </button>
                {logLocation && (
                    <button
                        className={styles.button}
                        data-testid={`copy-log-${game}-button`}
                        onClick={() => copyLogLocation(logLocation)}
                    >
                        {getText('copy')}
                    </button>
                )}
            </div>
        </SettingsSection>
    )
}

export default LogLocationSetting
