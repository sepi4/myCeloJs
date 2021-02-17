import React from 'react'
import styled from 'styled-components'

const Button = styled.button`
    margin: 0.2em 0;
    width: 25vw;
    color: #ddd;
    cursor: pointer;
    background-color: ${({ buttonColor }) => buttonColor || '#181818'};
    padding: .2em 0;
    font-size: 1em;
    border: 0;
    &:active {
        color: black;
        background-color: #ddd;
    }
`
const ContentDiv = styled.div`
    margin: .2em 0 0 0;
    min-width: 100%;
    min-height: 1em;
    color: black;
`
const Div = styled.div`
    margin: 1em 0;
    background-color: #616161;
    padding: 1em;
`

function SettingsDiv({
    title, 
    handler,
    children,
    buttonText,
    buttonColor,
}) {


    return <Div>
        {title && 
            <div style={{ 
                fontWeight: 'bold',
                fontSize: '120%',
            }} >{title}</div>}

        <ContentDiv>{children}</ContentDiv>

        {buttonText && 
            <Button
                onClick={handler}
                buttonColor={buttonColor}
            >
                {buttonText}
            </Button>
        }
    </Div>
}

export default SettingsDiv