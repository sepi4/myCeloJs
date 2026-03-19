import setPlayersWithoutChecking from '../../functions/checkers/setPlayersWithoutChecking'
import { readLog } from '../../functions/log-parsing/readLog'
import getText from '../../functions/utils/getText'
import { useAlertStore } from '../../stores/alertStore'
import { useAutoLogCheckingStore } from '../../stores/autoLogCheckingStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useSettingsStore } from '../../stores/settingsStore'
import styles from './CheckLogDiv.module.css'
import IntervalInput from './IntervalInput'
import NavCheckbox from './NavCheckBox'

function CheckLogDiv() {
    const { settings } = useSettingsStore()
    const { alert, toggleAlert } = useAlertStore()
    const { autoLogChecking, toggleAutoLogChecking } = useAutoLogCheckingStore()
    const {
        navButtons: { coh3 },
    } = useNavButtonsStore()

    const activeLogLocation = settings
        ? coh3
            ? settings.logLocationCoh3
            : settings.logLocationCoh2
        : ''

    const isTop = settings?.sidebarPosition === 'top'

    return (
        <div className={isTop ? styles.containerTop : styles.container}>
            <NavCheckbox
                text={getText('auto', settings)}
                checked={autoLogChecking}
                handler={toggleAutoLogChecking}
                testId="auto-label"
                title={getText('tooltip_auto', settings)}
            />

            {autoLogChecking ? (
                <>
                    <IntervalInput />
                    <NavCheckbox
                        text={getText('alert', settings)}
                        checked={alert}
                        handler={toggleAlert}
                        testId="alert-label"
                        title={getText('tooltip_alert', settings)}
                    />
                </>
            ) : null}

            <button
                data-testid="check-log-button"
                className={styles.btn}
                title={getText('tooltip_check_log', settings)}
                onClick={async () => {
                    const data = await readLog(coh3, activeLogLocation)
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
