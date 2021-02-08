import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faTimes, } from '@fortawesome/free-solid-svg-icons'

function Navbar({ handleSetSettingsView }) {
    const styleNavbar = {
        backgroundColor: '#181818',
        position: 'fixed',
        top: '0',
        left: '0',
        height: '3em',
        width: '100vw',
        borderBottom: '2px solid black',
        display: 'flex',
        alignItems: 'center',
        zIndex: '99999',
        justifyContent: 'flex-end', 
        color: 'white',
    }

    const state = useSelector(state => state)
    const dispatch =  useDispatch()

    return <div style={{ ...styleNavbar, }}>

        <FontAwesomeIcon
            icon={!state.settingsView ? faCogs : faTimes }
            size='2x'
            style={{
                cursor: 'pointer',
                marginRight: '0.5em',
            }}
            onClick={() => {
                dispatch({ type: 'TOGGLE_SETTINGS_VIEW' })
                handleSetSettingsView()
            }}
        />
    </div>
}

export default Navbar