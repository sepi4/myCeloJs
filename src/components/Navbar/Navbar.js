import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Navbar.module.css'

import { faCogs, faTimes, } from '@fortawesome/free-solid-svg-icons'

import getText from '../../functions/getText'

import NavCheckbox from './NavCheckBox'

import { StyledRow } from '../styled/StyledFlex'
import { StyledColumn } from '../styled/StyledFlex'

import NavBarIcon from './NavbarIcon'
import CheckLogDiv from './CheckLogDiv'

export default function Navbar({ handleSetSettingsView }) {
    const state = useSelector(state => state)
    const settings = state.settings
    const dispatch = useDispatch()

    const settingsViewToggeler = () => {
        dispatch({ type: 'TOGGLE_SETTINGS_VIEW' })
        handleSetSettingsView()
    }

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

    if (state.settingsView) {
        return <div
            className={styles.navbar}
            style={{ justifyContent: 'flex-end' }}
        >
            <NavBarIcon icon={faTimes} fun={settingsViewToggeler} />
        </div>
    }

    return <div
        className={styles.navbar}
    >
        <div className={styles.container}>
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
                    <CheckLogDiv />
                </StyledRow>
            </StyledColumn>
        </div>
        <NavBarIcon icon={faCogs} fun={settingsViewToggeler} />
    </div>
}