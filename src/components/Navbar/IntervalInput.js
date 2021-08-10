import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import getText from '../../functions/getText'
import styles from './IntervalInput.module.css'

function IntervalInput() {
    const state = useSelector(state => state)
    const settings = state.settings

    const dispatch = useDispatch()

    const [error, setError] = useState(false)
    const refInputElement = useRef(null);

    const checkNumbers = e => {
        setError(false)
        const x = parseInt(e.target.value)
        if (!isNaN(x) && x > 0 && x < 1000 && x !== state.logCheckInterval) {
            dispatch({
                type: 'SET_INTERVAL',
                data: x,
            })
            refInputElement.current.value = x
            e.target.blur()
        } else {
            refInputElement.current.value = state.logCheckInterval
            if (x !== state.logCheckInterval) {
                setError(true)
                setTimeout(() => setError(false), 5000)
            }
        }
    }

    return <span className={styles.container}>
        <input
            className={styles.input}
            defaultValue={state.logCheckInterval
                ? state.logCheckInterval
                : ""
            }
            ref={refInputElement}
            onBlur={checkNumbers}
            onKeyDown={e => e.key === 'Enter'
                ? checkNumbers(e)
                : error
                    ? setError(false)
                    : null
            }
        />
        <span>{getText('sec', settings)}</span>
        {error &&
            <div className={styles.error}>
                {getText('integer_error', settings)}
            </div>
        }
    </span>
}

export default IntervalInput