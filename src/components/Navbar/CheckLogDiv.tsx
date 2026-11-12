import { GAME_CONFIG } from '../../constants/games'
import setPlayersWithoutChecking from '../../functions/checkers/setPlayersWithoutChecking'
import { readLog } from '../../functions/log-parsing/readLog'
import getText from '../../functions/utils/getText'
import { useAlertStore } from '../../stores/alertStore'
import { useAutoLogCheckingStore } from '../../stores/autoLogCheckingStore'
import { useGameStore } from '../../stores/gameStore'
import { useSettingsStore } from '../../stores/settingsStore'
import Choice from '../Choice'

import styles from './CheckLogDiv.module.css'

function CheckLogDiv() {
    const { settings } = useSettingsStore()
    const { alert, toggleAlert } = useAlertStore()
    const { autoLogChecking, toggleAutoLogChecking } = useAutoLogCheckingStore()
    const { game } = useGameStore()

    const activeLogLocation = settings ? settings[GAME_CONFIG[game].logLocationKey] : ''

    const isTop = settings?.navbarPosition !== 'left' && settings?.navbarPosition !== 'right'

    return (
        <div className={isTop ? styles.containerTop : styles.container}>
            <Choice
                type="checkbox"
                label={getText('auto', settings)}
                checked={autoLogChecking}
                onChange={toggleAutoLogChecking}
                testId="checkbox-auto"
                title={getText('tooltip_auto', settings)}
            />

            {autoLogChecking ? (
                <Choice
                    type="checkbox"
                    label={getText('alert', settings)}
                    checked={alert}
                    onChange={toggleAlert}
                    testId="checkbox-alert"
                    title={getText('tooltip_alert', settings)}
                />
            ) : null}

            <button
                data-testid="check-log-button"
                className={styles.btn}
                title={getText('tooltip_check_log', settings)}
                onClick={async () => {
                    const data = await readLog(game, activeLogLocation)
                    if (data) {
                        setPlayersWithoutChecking(data)
                    }
                }}
            >
                {getText('check_log_button', settings)}
            </button>
        </div>
    )
}

export default CheckLogDiv
