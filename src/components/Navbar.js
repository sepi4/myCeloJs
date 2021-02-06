import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faCaretRight, 
    faCaretDown,
    faCogs,
    faTimes,
} from '@fortawesome/free-solid-svg-icons'

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
        justifyContent: 'space-evenly',
        alignItems: 'center',
        zIndex: '99999',
    }

    const styleRadiobutton = {
        display: 'flex',
        alignItems: 'center',
        fontSize: '80%',
    }

    const state = useSelector(state => state)
    const dispatch =  useDispatch()

    const settingsIcon = 'fa fa-2x fa-cogs'
    const crossIcon = 'fa fa-2x fa-times'

    return <div style={{ 
        ...styleNavbar, 
        justifyContent: 'space-between', 
        color: 'white',
    }}>

        <div style={{
            marginLeft: '5%',
        }}>

            <div style={styleRadiobutton}>
                <input
                    type="radio"
                    name="list"
                    id="list"
                    defaultChecked
                    onChange={() => dispatch({ type: 'TOGGLE_LIST' })}
                />
                <label
                    htmlFor="list"
                    style={{
                        marginLeft: '0.5em',
                    }}
                >list</label>
            </div>
            <div style={styleRadiobutton}>
                <input
                    type="radio"
                    name="list"
                    id="table"
                    onChange={() => dispatch({ type: 'TOGGLE_LIST' })}
                />
                <label
                    htmlFor="table"
                    style={{
                        marginLeft: '0.5em',
                    }}
                >table</label>
            </div>

        </div>
        

        <FontAwesomeIcon
            icon={!state.settingsView ? faCogs : faTimes }
            size='2x'
            // className={!state.settingsView ? settingsIcon : crossIcon }
            style={{
                cursor: 'pointer',
                marginRight: '5%',
            }}
            onClick={() => {
                dispatch({ type: 'TOGGLE_SETTINGS_VIEW' })
                handleSetSettingsView()
            }}
        />

        {/* <i
            className={!state.settingsView ? settingsIcon : crossIcon }
            style={{
                cursor: 'pointer',
                marginRight: '5%',
            }}
            onClick={() => {
                dispatch({ type: 'TOGGLE_SETTINGS_VIEW' })
                handleSetSettingsView()
            }}
        /> */}
    </div>
}

export default Navbar