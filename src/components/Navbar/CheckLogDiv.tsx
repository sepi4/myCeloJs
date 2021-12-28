import React from 'react'
import IntervalInput from './IntervalInput'

import setPlayersWithoutChecking from '../../functions/setPlayersWithoutChecking'
import { readLog } from '../../functions/readLog/readLog'
import getText from '../../functions/getText'

import NavCheckbox from './NavCheckBox'
import styles from './CheckLogDiv.module.css'
import { useAppDispatch, useAppSelector } from '../../hooks/customReduxHooks'
import { SettingsType } from '../../types'

function CheckLogDiv() {
    const state = useAppSelector((state) => state)
    const settings: SettingsType = state.settings
    const dispatch = useAppDispatch()

    return (
        <div className={styles.container}>
            <NavCheckbox
                text={getText('auto', settings)}
                checked={state.autoLogChecking ? state.autoLogChecking : false}
                handler={() =>
                    dispatch({
                        type: 'TOGGLE_AUTO_LOG_CHECKING',
                    })
                }
            />

            {state.autoLogChecking ? (
                <>
                    <IntervalInput />
                    <NavCheckbox
                        text={getText('alert', settings)}
                        checked={state.alert ? state.alert : false}
                        handler={() =>
                            dispatch({
                                type: 'TOGGLE_ALERT',
                            })
                        }
                    />
                </>
            ) : (
                <button
                    className={styles.btn}
                    onClick={() => {
                        readLog(state.settings.logLocation).then((data) => {
                            if (data) {
                                setPlayersWithoutChecking(data, state, dispatch)
                            }
                        })
                    }}
                >
                    {getText('check_log_button', settings)}
                </button>
            )}
        </div>
    )
}

export default CheckLogDiv
