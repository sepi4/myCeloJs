import React from 'react'
import { useSelector } from 'react-redux'

import electron from 'electron'
const { clipboard } = electron.remote

import Notification from '../Notification'

import { StyledTextDiv, StyledButton } from '../styled/styledSettings'
import useTimedBoolean from '../../hooks/useTimedBoolean'

import getText from '../../functions/getText'

function CopyDiv({ text }) {
    const state = useSelector(state => state)
    const { settings } = state
    const lg = settings ? settings.language : 'en'


    const [timed, setTimed] = useTimedBoolean(1000)
    const handleCopy = () => {
        setTimed(true)
        clipboard.writeText(text)
        console.log('handlecopy')
    }

    if (!text) {
        return null
    }
    return (
        <div>
            <StyledTextDiv>
                {text}
                {timed && <Notification text={getText('copied', lg)} />}
            </StyledTextDiv>

            <StyledButton
                onClick={handleCopy}
                buttonColor='black'
            >{getText('copy', lg)}</StyledButton>
        </div>
    )
}

export default CopyDiv