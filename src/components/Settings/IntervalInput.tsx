import React, { useRef, useState } from 'react'

import useText from '../../hooks/useText'
import { useLogCheckIntervalStore } from '../../stores/logCheckIntervalStore'
import { useSettingsStore } from '../../stores/settingsStore'
import SettingsDiv from './SettingsDiv'

import styles from './Settings.module.css'

function IntervalInput() {
    const getText = useText()
    const { settings } = useSettingsStore()
    const { logCheckInterval, setLogCheckInterval } = useLogCheckIntervalStore()

    const [error, setError] = useState(false)
    const refInputElement = useRef<HTMLInputElement>(null)

    const checkNumbers = (
        e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>
    ) => {
        setError(false)
        const seconds = parseInt(e.currentTarget.value)
        if (!isNaN(seconds) && seconds > 0 && seconds < 1000 && seconds !== logCheckInterval) {
            setLogCheckInterval(seconds)
            if (refInputElement?.current) {
                refInputElement.current.value = seconds + ''
            }
            e.currentTarget.blur()
        } else {
            if (refInputElement?.current) {
                refInputElement.current.value = logCheckInterval + ''
            }
            if (seconds !== logCheckInterval) {
                setError(true)
                setTimeout(() => setError(false), 5000)
            }
        }
    }

    if (!settings || (!settings.logLocationCoh2 && !settings.logLocationCoh3)) {
        return null
    }

    return (
        <SettingsDiv title={getText('log_check_interval_title')}>
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
                <span>{getText('sec')}</span>
                {error && <span className={styles.error}>{getText('integer_error')}</span>}
            </div>
        </SettingsDiv>
    )
}

export default IntervalInput
