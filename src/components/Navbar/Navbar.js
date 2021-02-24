import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import checkLogData from '../../functions/checkLogData'
import { readLog } from '../../functions/readLog'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faTimes, } from '@fortawesome/free-solid-svg-icons'

import styled from 'styled-components'

import NavCheckbox from './NavCheckBox'

import { StyledRow } from '../styled/StyledFlex'
import { StyledColumn } from '../styled/StyledFlex'

const Div = styled.div`
    margin: 0 1.2em;
    display: flex;
    justify-content: flex-start;
    height: 100%;
    width: 100%;
    color: gray;
`

const StyledButton = styled.button`
    margin: 0.2em 0;
    width: 6em;
    color: black;
    background-color: gray;
    border-radius: 0.2em;
    border: 0;

    cursor: pointer;
    padding: .2em 0;
    font-size: 1em;
    &:active {
        background-color: #fff;
    }
    &:hover {
        opacity: 70%;
    }
`

export default function Navbar({ handleSetSettingsView }) {
    const styleNavbar = {
        backgroundColor: '#181818',
        color: '#ddd',
        position: 'fixed',
        top: '0',
        left: '0',
        height: '3em',
        width: '100vw',
        borderBottom: '2px solid black',
        display: 'flex',
        alignItems: 'center',
        zIndex: '99999',
        justifyContent: state && !state.settingsView
            ? 'space-between'
            : 'flex-end',

    }

    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const fun = () => {
        dispatch({ type: 'TOGGLE_SETTINGS_VIEW' })
        handleSetSettingsView()
    }

    const [error, setError] = useState(false)

    const navButtons = useSelector(state => state.navButtons)
    const [all, table] = ['all', 'table'].map(text => {
        return <NavCheckbox
            key={text}
            text={text}
            checked={navButtons[text]}
            handler={() => dispatch({
                type: 'TOGGLE_NAVBUTTON',
                key: text,
            })}
        />
    })

    const inputEl = useRef(null);
    const checkNumbers = e => {
        setError(false)

        const x = parseInt(e.target.value)
        if (!isNaN(x) && x > 0 && x < 1000 && x !== state.logCheckInterval) {
            dispatch({
                type: 'SET_INTERVAL',
                data: x,
            })
            inputEl.current.value = x
            e.target.blur()
        } else {
            inputEl.current.value = state.logCheckInterval
            if (x !== state.logCheckInterval) {
                setError(true)
                setTimeout(() => setError(false), 5000)
            }
        }
    }

    return <div style={{ ...styleNavbar, }}>
        {!state.settingsView && <>
            <Div>
                <StyledColumn>
                    {table}
                    {all}
                </StyledColumn>

                <StyledRow margin='0 0 0 2em'>
                    <NavCheckbox
                        text={'auto'}
                        checked={state.autoLogChecking
                            ? state.autoLogChecking
                            : false
                        }
                        handler={() => dispatch({
                            type: 'TOGGLE_AUTO_LOG_CHECKING'
                        })}
                    />

                    <div style={{ marginLeft: '.5em' }} >
                        {state.autoLogChecking
                            ? <>
                                <input
                                    defaultValue={state.logCheckInterval
                                        ? state.logCheckInterval
                                        : ""
                                    }
                                    ref={inputEl}
                                    onBlur={checkNumbers}
                                    onKeyDown={e => e.key === 'Enter'
                                        ? checkNumbers(e)
                                        : error
                                            ? setError(false)
                                            : null
                                    }
                                    style={{
                                        backgroundColor: '#181818',
                                        color: '#ddd',
                                        height: '1.5em',
                                        width: '3.5em',
                                        border: 'none',
                                        borderBottom: 'solid .1em gray',
                                        fontSize: '110%',
                                        textAlign: 'center',
                                    }}
                                /><span>sec</span>
                                {error &&
                                    <div style={{
                                        position: 'absolute',
                                        top: '.1em',
                                        color: 'red',
                                        fontSize: '70%',
                                    }}>integer 1-999</div>
                                }
                            </>
                            : <StyledButton
                                onClick={() => {
                                    readLog(state.settings.logLocation, data => {
                                        checkLogData(data, state, dispatch)
                                    })
                                }}
                            >check</StyledButton>
                        }
                    </div>
                </StyledRow>

            </Div>
        </>
        }

        <div
            style={{
                cursor: 'pointer',
                marginRight: '1em',
                display: 'block',
            }}
            onClick={fun}
        >
            <FontAwesomeIcon
                icon={!state.settingsView ? faCogs : faTimes}
                size='2x'
                color='gray'
            />
        </div>
    </div>
}

