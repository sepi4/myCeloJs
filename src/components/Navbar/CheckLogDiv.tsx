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

    return (
        <div className={styles.container}>
            <NavCheckbox
                text={getText('auto', settings)}
                checked={autoLogChecking}
                handler={toggleAutoLogChecking}
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
                            />
                        </>
                    ) : null}
                    <button
                        className={styles.btn}
                        onClick={() => {
                            readLog(coh3, settings!.logLocation).then(
                                (data) => {
                                    if (data) {
                                        setPlayersWithoutChecking(data)
                                    }
                                }
                            )
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
