import IntervalInput from './IntervalInput'

import setPlayersWithoutChecking from '../../functions/setPlayersWithoutChecking'
import { readLog } from '../../functions/readLog/readLog'
import getText from '../../functions/getText'

import NavCheckbox from './NavCheckBox'
import styles from './CheckLogDiv.module.css'
import { useAlertStore } from '../../stores/alertStore'
import { useAutoLogCheckingStore } from '../../stores/autoLogCheckingStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useSettingsStore } from '../../stores/settingsStore'

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

    return (
        <div className={styles.container}>
            <NavCheckbox
                text={getText('auto', settings)}
                checked={autoLogChecking}
                handler={toggleAutoLogChecking}
                testId="auto-label"
            />

            {
                <>
                    {autoLogChecking ? (
                        <>
                            <IntervalInput />
                            <NavCheckbox
                                text={getText('alert', settings)}
                                checked={alert}
                                handler={toggleAlert}
                                testId="alert-label"
                            />
                        </>
                    ) : null}
                    <button
                        data-testid="check-log-button"
                        className={styles.btn}
                        onClick={() => {
                            readLog(coh3, activeLogLocation).then((data) => {
                                if (data) {
                                    setPlayersWithoutChecking(data)
                                }
                            })
                        }}
                    >
                        {getText('check_log_button', settings)}
                    </button>
                </>
            }
        </div>
    )
}

export default CheckLogDiv
