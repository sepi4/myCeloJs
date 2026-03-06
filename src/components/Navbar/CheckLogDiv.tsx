import IntervalInput from './IntervalInput'

import setPlayersWithoutChecking from '../../functions/setPlayersWithoutChecking'
import { readLog } from '../../functions/readLog/readLog'
import getText from '../../functions/getText'

import NavCheckbox from './NavCheckBox'
import styles from './CheckLogDiv.module.css'
import { useAppDispatch, useAppSelector } from '../../hooks/customReduxHooks'
import { useAlertStore } from '../../stores/alertStore'
import { useAutoLogCheckingStore } from '../../stores/autoLogCheckingStore'
import { SettingsType } from '../../types'

function CheckLogDiv() {
    const state = useAppSelector((state) => state)
    const settings: SettingsType = state.settings
    const dispatch = useAppDispatch()
    const { alert, toggleAlert } = useAlertStore()
    const { autoLogChecking, toggleAutoLogChecking } = useAutoLogCheckingStore()

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
                            readLog(state.navButtons.coh3, state.settings.logLocation).then((data) => {
                                if (data) {
                                    setPlayersWithoutChecking(
                                        data,
                                        state,
                                        dispatch
                                    )
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
