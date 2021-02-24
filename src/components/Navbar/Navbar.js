import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'

import { faCogs, faTimes, } from '@fortawesome/free-solid-svg-icons'

import checkLogData from '../../functions/checkLogData'
import { readLog } from '../../functions/readLog'

import NavCheckbox from './NavCheckBox'

import { StyledRow } from '../styled/StyledFlex'
import { StyledColumn } from '../styled/StyledFlex'

import { StyledInputDiv } from './StyledInputDiv'
import { StyledNavbar } from './StyledNavbar'
import NavBarIcon from './NavbarIcon'

const Div = styled.div`
    margin: 0 1.2em;
    display: flex;
    justify-content: space-evenly;
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

    const intervalInput = (
        <StyledInputDiv>
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
            />
            <span>sec</span>
            {error &&
                <div className='error'>integer 1-999</div>
            }
        </StyledInputDiv>
    )

    if (state.settingsView) {
        return <StyledNavbar justifyContent='flex-end'>
            <NavBarIcon icon={faTimes} fun={fun} />
        </StyledNavbar>
    }

    return <StyledNavbar>
        <Div>
            <StyledColumn>
                {table}
                {all}
            </StyledColumn>

            <StyledRow>
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
                        ? intervalInput
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

        <NavBarIcon icon={faCogs} fun={fun} />
    </StyledNavbar>
}