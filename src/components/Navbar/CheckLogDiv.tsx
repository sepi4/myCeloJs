import { GAME_CONFIG } from '../../constants/games'
import setPlayersWithoutChecking from '../../functions/checkers/setPlayersWithoutChecking'
import { readLog } from '../../functions/log-parsing/readLog'
import useText from '../../hooks/useText'
import { useAlertStore } from '../../stores/alertStore'
import { useAutoLogCheckingStore } from '../../stores/autoLogCheckingStore'
import { useGameStore } from '../../stores/gameStore'
import { useSettingsStore } from '../../stores/settingsStore'
import Choice from '../Choice'

import styles from './CheckLogDiv.module.css'

function CheckLogDiv() {
    const getText = useText()
    const { settings } = useSettingsStore()
    const { alert, toggleAlert } = useAlertStore()
    const { autoLogChecking, toggleAutoLogChecking } = useAutoLogCheckingStore()
    const { game } = useGameStore()

    const activeLogLocation = settings?.[GAME_CONFIG[game].logLocationKey] ?? ''

    const isTop = settings?.navbarPosition !== 'left' && settings?.navbarPosition !== 'right'

    return (
        <div className={isTop ? styles.containerTop : styles.container}>
            <Choice
                type="checkbox"
                label={getText('auto')}
                checked={autoLogChecking}
                onChange={toggleAutoLogChecking}
                testId="checkbox-auto"
                title={getText('tooltip_auto')}
            />

            {autoLogChecking ? (
                <Choice
                    type="checkbox"
                    label={getText('alert')}
                    checked={alert}
                    onChange={toggleAlert}
                    testId="checkbox-alert"
                    title={getText('tooltip_alert')}
                />
            ) : null}

            <button
                data-testid="check-log-button"
                className={styles.btn}
                title={getText('tooltip_check_log')}
                onClick={async () => {
                    const data = await readLog(game, activeLogLocation)
                    if (data) {
                        setPlayersWithoutChecking(data)
                    }
                }}
            >
                {getText('check_log_button')}
            </button>
        </div>
    )
}

export default CheckLogDiv
