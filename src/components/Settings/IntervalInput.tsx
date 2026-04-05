import React, { useRef, useState } from 'react'

import getText from '../../functions/utils/getText'
import { useLogCheckIntervalStore } from '../../stores/logCheckIntervalStore'
import { useSettingsStore } from '../../stores/settingsStore'
import styles from './Settings.module.css'
import SettingsDiv from './SettingsDiv'

function IntervalInput() {
    const { settings } = useSettingsStore()
    const { logCheckInterval, setLogCheckInterval } = useLogCheckIntervalStore()

    const [error, setError] = useState(false)
    const refInputElement = useRef<HTMLInputElement>(null)

    const checkNumbers = (
        e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>
    ) => {
        setError(false)
        const x = parseInt(e.currentTarget.value)
        if (!isNaN(x) && x > 0 && x < 1000 && x !== logCheckInterval) {
            setLogCheckInterval(x)
            if (refInputElement?.current) {
                refInputElement.current.value = x + ''
            }
            e.currentTarget.blur()
        } else {
            if (refInputElement?.current) {
                refInputElement.current.value = logCheckInterval + ''
            }
            if (x !== logCheckInterval) {
                setError(true)
                setTimeout(() => setError(false), 5000)
            }
        }
    }

    if (!settings || (!settings.logLocationCoh2 && !settings.logLocationCoh3)) {
        return null
    }

    return (
        <SettingsDiv title={getText('log_check_interval_title', settings)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                <input
                    data-testid="interval-input"
                    className={styles.input}
                    style={{ width: '5em', paddingRight: '0.3em', textAlign: 'center' }}
                    defaultValue={logCheckInterval ? logCheckInterval : ''}
                    ref={refInputElement}
                    onBlur={checkNumbers}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                        e.key === 'Enter' ? checkNumbers(e) : error ? setError(false) : null
                    }
                />
                <span>{getText('sec', settings)}</span>
                {error && (
                    <span className={styles.error}>{getText('integer_error', settings)}</span>
                )}
            </div>
        </SettingsDiv>
    )
}

export default IntervalInput
