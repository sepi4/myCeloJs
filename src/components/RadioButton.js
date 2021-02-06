import React from 'react'
import { useDispatch } from 'react-redux'


function RadioButton({ text, checked }) {
    const dispatch =  useDispatch()

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
            onChange={() => dispatch({ type: 'TOGGLE_LIST' })}
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
