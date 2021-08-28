import React from 'react'
import { useSelector } from 'react-redux'

import electron from 'electron'
const { clipboard } = electron.remote

import Notification from '../Notification'

import { StyledButton } from '../styled/styledSettings'
import styles from './Settings.module.css'

import useTimedBoolean from '../../hooks/useTimedBoolean'

import getText from '../../functions/getText'

function CopyDiv({ text }) {
    const state = useSelector(state => state)
    const { settings } = state

    const [timed, setTimed] = useTimedBoolean(1000)
    const handleCopy = () => {
        setTimed(true)
        clipboard.writeText(text)
    }

    if (!text) {
        return null
    }
    const notification = timed
        ? <Notification text={getText('copied', settings)} />
        : null

    return (
        <div>
            <div className={styles.textDiv}>
                {text}
                {notification}
            </div>

            <StyledButton onClick={handleCopy} >
                {getText('copy', settings)}
            </StyledButton>
        </div>
    )
}

export default CopyDiv