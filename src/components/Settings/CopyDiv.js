import React from 'react'
import electron from 'electron'
const { clipboard } = electron.remote

import useTimedBoolean from '../../hooks/useTimedBoolean'
import Notification from '../Notification'

import { StyledTextDiv, StyledButton } from '../styled/styledSettings'

function CopyDiv({text}) {

    const [timed, setTimed] = useTimedBoolean(1000)
    const handleCopy = () => {
        setTimed(true)
        clipboard.writeText(text)
    }

    if (!text) {
        return null
    }
    return (
        <div>
            <StyledTextDiv>
                {text}
                {timed && <Notification text='copied' />}
            </StyledTextDiv>

            <StyledButton
                onClick={handleCopy}
                buttonColor='black'
            >Copy</StyledButton>
        </div>
    ) 
}

export default CopyDiv