import React from 'react'

function SettingsDiv({
    title, 
    handler,
    children,
    buttonText,
    buttonColor,
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
        backgroundColor: buttonColor ? buttonColor : '#181818',
        // border: '2px solid #181818',
        color: 'white',
        height: '1.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }


    return <div style={divStyle}>
        {title
            && <div style={{ fontWeight: 'bold' }} >{title}</div>
        }
        <div style={locationStyle} >
            {children}
        </div>
        {buttonText 
            && <div style={buttonStyle} onClick={handler} >{buttonText} </div>
        }
    </div>
}

export default SettingsDiv