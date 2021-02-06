import React from 'react'
import { useSelector, } from 'react-redux'

function SettingsInputDiv({
    text, 
    settingsKey, 
    clickFun,
}) {
    const locationStyle = {
        margin: '.2em 0 0 .2em',
        minWidth: '100%',
        minHeight: '1em',
    }
    const divStyle = {
        margin: '1em 0',
        backgroundColor: '#616161',
        padding: '1em',
    }
    const buttonStyle = {
        padding: '0',
        margin: '0.2em 0',
        width: '25vw',
        cursor: 'pointer',
        backgroundColor: '#181818',
        border: '2px solid #181818',
        color: 'white',
        height: '1.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
    const settings = useSelector(state => state.settings)
    return <div style={divStyle}>
        <div style={{ fontWeight: 'bold' }} >{text}</div>
        <div style={locationStyle} >
            {settings && settings[settingsKey]
                ? settings[settingsKey]
                : ''
            }
        </div>
        <div style={buttonStyle} onClick={clickFun} >Select </div>
    </div>
}

export default SettingsInputDiv