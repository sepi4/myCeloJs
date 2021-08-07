import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'

import { faCogs, faTimes, } from '@fortawesome/free-solid-svg-icons'

import setPlayersWithoutChecking from '../../functions/setPlayersWithoutChecking'
import { readLog } from '../../functions/readLog/readLog'
import getText from '../../functions/getText'

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

const StyledButton = styled.div`
    text-align: center;

    margin: 0;
    width: 6em;

    color: black;
    background-color: gray;
    border-radius: 0.2em;
    border: 0;


    cursor: pointer;
    padding: .2em 0;
    &:active {
        background-color: #fff;
    }
    &:hover {
        opacity: 70%;
    }
`

export default function Navbar({ handleSetSettingsView }) {


    const state = useSelector(state => state)
    const settings = useSelector(state => state.settings)
    // const lg = settings ? settings.language : 'en'


    const dispatch = useDispatch()

    const fun = () => {
        dispatch({ type: 'TOGGLE_SETTINGS_VIEW' })
        handleSetSettingsView()
    }

    const [error, setError] = useState(false)

    const navButtons = useSelector(state => state.navButtons)
    const [all, table, total] = ['all', 'table', 'total'].map(text => {
        return <NavCheckbox
            key={text}
            text={getText(text, settings)}
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
            <span>{getText('sec', settings)}</span>
            {error &&
                <div className='error'>
                    {getText('integer_error', settings)}
                </div>
            }
        </StyledInputDiv>
    )

    const checkLogDiv = (
        <div style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            width: '100%',
        }}>
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
                ? <>
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
                : <StyledButton
                    onClick={() => {

                        readLog(
                            state.settings.logLocation,
                            data => setPlayersWithoutChecking(
                                data, state, dispatch
                            ),
                        )
                    }}
                >{getText('check_log_button', settings)}</StyledButton>
            }
        </div>
    )

    if (state.settingsView) {
        return <StyledNavbar justifyContent='flex-end'>
            <NavBarIcon icon={faTimes} fun={fun} />
        </StyledNavbar>
    }


    return <StyledNavbar>
        <Div>
            <StyledColumn>
                <StyledRow>
                    <div style={{ fontSize: '70%' }}>
                        {getText('dropdown_info', settings)}
                    </div>
                </StyledRow>
                <StyledRow>
                    {table}
                    {all}
                    {total}
                </StyledRow>
            </StyledColumn>

            <StyledColumn>
                <StyledRow>
                    <div style={{ fontSize: '70%' }}>
                        {getText('log_checking', settings)}
                    </div>
                </StyledRow>
                <StyledRow>
                    {checkLogDiv}
                </StyledRow>
            </StyledColumn>
        </Div>
        <NavBarIcon icon={faCogs} fun={fun} />
    </StyledNavbar>
}