import React from 'react'

function RadioButtonsDiv({ title, children }) {
    return <>
        <div style={{
            fontSize: '70%',
        }}>{title}</div>

        <form style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            fontSize: '90%',

            padding: '0.2em 0',
            margin: '0 0 0.5em 0',

        }}>{children}</form>
    </>
}

export default RadioButtonsDiv
