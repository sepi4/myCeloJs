import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function NavButton({ text }) {
    const dispatch = useDispatch()
    const navButtons = useSelector(state => state.navButtons)

    return <button
        style={{
            backgroundColor: navButtons[text] ? 'gray' : '#181818',
            color: navButtons[text] ? 'black' : 'gray',
            fontWeight: navButtons[text] ? 'bold' : null,
            outline: navButtons[text] ? '0.1em solid black' : null,
            outlineOffset: navButtons[text] ? '-0.2em' : null,
            border: '0.1em solid gray',

            fontSize: '1em',
            width: '5em',
            height: '1.5em',
            margin: '.4em',
            cursor: 'pointer',
        }}
        onClick={() => {
            dispatch({
                type: 'TOGGLE_NAVBUTTON',
                key: text,
            })
        }}
    >{text}</button>
}

export default NavButton