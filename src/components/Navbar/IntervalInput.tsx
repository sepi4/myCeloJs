/* eslint-disable indent */
import React, { useRef, useState } from 'react'

import getText from '../../functions/getText'
import styles from './IntervalInput.module.css'
import { useLogCheckIntervalStore } from '../../stores/logCheckIntervalStore'
import { useSettingsStore } from '../../stores/settingsStore'

function IntervalInput() {
    const { settings } = useSettingsStore()
    const { logCheckInterval, setLogCheckInterval } = useLogCheckIntervalStore()

    const [error, setError] = useState(false)
    const refInputElement = useRef<HTMLInputElement>(null)

    const checkNumbers = (
        e:
            | React.FocusEvent<HTMLInputElement>
            | React.KeyboardEvent<HTMLInputElement>
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

    return (
        <span className={styles.container}>
            <input
                data-testid="interval-input"
                className={styles.input}
                defaultValue={logCheckInterval ? logCheckInterval : ''}
                ref={refInputElement}
                onBlur={checkNumbers}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    e.key === 'Enter'
                        ? checkNumbers(e)
                        : error
                          ? setError(false)
                          : null
                }
            />
            <span>{getText('sec', settings)}</span>
            {error && (
                <div className={styles.error}>
                    {getText('integer_error', settings)}
                </div>
            )}
        </span>
    )
}

export default IntervalInput
