import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import setPlayersWithoutChecking from '../../functions/setPlayersWithoutChecking'
import { readLog } from '../../functions/readLog/readLog'
import getText from '../../functions/getText'

import NavCheckbox from './NavCheckBox'
import styles from './CheckLogDiv.module.css'

import styled from 'styled-components'

const StyledInputDiv = styled.span`
    width: 6em;

    input {
        background-color: #181818;
        color: #ddd;
        height: 1em;
        width: 3.5em;
        border: none;
        border-bottom: solid .1em gray;
        font-size: 110%;
        text-align: center;
    }

    .error {
        position: absolute;
        top: .1em;
        color: red;
        font-size: 70%;
    }

`

function CheckLogDiv() {
    const state = useSelector(state => state)
    const settings = state.settings

    const [error, setError] = useState(false)
    const dispatch = useDispatch()

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

    const intervalInput = (
        <StyledInputDiv>
            <input
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
                <div className='error'>
                    {getText('integer_error', settings)}
                </div>
            }
        </StyledInputDiv>
    )

    return (
        <div className={styles.container}>
            <NavCheckbox
                text={getText('auto', settings)}
                checked={state.autoLogChecking
                    ? state.autoLogChecking
                    : false
                }
                handler={() => dispatch({
                    type: 'TOGGLE_AUTO_LOG_CHECKING'
                })}
            />

            {state.autoLogChecking
                ? (
                    <>
                        {intervalInput}
                        <NavCheckbox
                            text={getText('alert', settings)}
                            checked={state.alert
                                ? state.alert
                                : false
                            }
                            handler={() => dispatch({
                                type: 'TOGGLE_ALERT'
                            })}
                        />
                    </>
                )
                : (
                    <button
                        className={styles.btn}
                        onClick={() => {
                            readLog(
                                state.settings.logLocation,
                                data => setPlayersWithoutChecking(
                                    data, state, dispatch
                                ),
                            )
                        }}
                    >
                        {getText('check_log_button', settings)}
                    </button>
                )
            }
        </div>
    )
}

export default CheckLogDiv