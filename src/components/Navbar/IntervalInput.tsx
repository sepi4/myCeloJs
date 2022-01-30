/* eslint-disable indent */
import { TextField } from '@mui/material'
import React, { useRef, useState } from 'react'

import getText from '../../functions/getText'
import { useAppDispatch, useAppSelector } from '../../hooks/customReduxHooks'
import { SettingsType } from '../../types'
import styles from './IntervalInput.module.css'

function IntervalInput() {
    const state = useAppSelector((state) => state)
    const settings: SettingsType = state.settings

    const dispatch = useAppDispatch()

    const [error, setError] = useState(false)
    const refInputElement = useRef<HTMLInputElement>(null)

    const checkNumbers = (e: React.FocusEvent<HTMLInputElement>) => {
        setError(false)
        const x = parseInt(e.target.value)
        if (!isNaN(x) && x > 0 && x < 1000 && x !== state.logCheckInterval) {
            dispatch({
                type: 'SET_INTERVAL',
                data: x,
            })
            if (refInputElement?.current) {
                refInputElement.current.value = x + ''
            }
            e.target.blur()
        } else {
            if (refInputElement?.current) {
                refInputElement.current.value = state.logCheckInterval
            }
            if (x !== state.logCheckInterval) {
                setError(true)
                setTimeout(() => setError(false), 5000)
            }
        }
    }

    return (
        <span className={styles.container}>
            <TextField
                sx={{
                    padding: 0,
                    margin: 0,
                    '& .MuiOutlinedInput-input': {
                        margin: '0.1em',
                        padding: '0.1em',
                        color: '#808080',
                        textAlign: 'center',
                    },
                }}
                error={error}
                focused
                // helperText={error ? getText('integer_error', settings) : ''}
                // color="blue"

                size="small"
                // id="outlined-uncontrolled"
                label={getText('sec', settings)}
                defaultValue={
                    state.logCheckInterval ? state.logCheckInterval : ''
                }
                ref={refInputElement}
                onBlur={checkNumbers}
                onKeyDown={(e: any) =>
                    e.key === 'Enter'
                        ? checkNumbers(e)
                        : error
                        ? setError(false)
                        : null
                }
            />

            {/* <input
                className={styles.input}
                defaultValue={
                    state.logCheckInterval ? state.logCheckInterval : ''
                }
                ref={refInputElement}
                onBlur={checkNumbers}
                // TODO fix any
                onKeyDown={(e: any) =>
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
            )} */}
        </span>
    )
}

export default IntervalInput
