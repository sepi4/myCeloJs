import React from 'react'

function RadioButton({ text, checked, handler }) {

    const styleRadiobutton = {
        display: 'flex',
        alignItems: 'center',
        fontSize: '80%',
    }

    return <div style={styleRadiobutton}>
        <input
            type="radio"
            name="list"
            id={text}
            defaultChecked={checked}
            onChange={handler}
        />
        <label
            htmlFor={text}
            style={{
                marginLeft: '0.5em',
            }}
        >{text}</label>
    </div>
}

export default RadioButton
