import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faTimes, } from '@fortawesome/free-solid-svg-icons'
import RadioButton from './RadioButton'

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
        // justifyContent: 'space-evenly',
        alignItems: 'center',
        zIndex: '99999',
        justifyContent: 'space-between', 
        color: 'white',
    }

    const state = useSelector(state => state)
    const dispatch =  useDispatch()

    return <div style={{ ...styleNavbar, }}>

        <div style={{ marginLeft: '5%', }}>
            <RadioButton text='list' checked={true} />
            <RadioButton text='table' checked={false} />
        </div>

        <FontAwesomeIcon
            icon={!state.settingsView ? faCogs : faTimes }
            size='2x'
            style={{
                cursor: 'pointer',
                marginRight: '5%',
            }}
            onClick={() => {
                dispatch({ type: 'TOGGLE_SETTINGS_VIEW' })
                handleSetSettingsView()
            }}
        />
    </div>
}

export default Navbar