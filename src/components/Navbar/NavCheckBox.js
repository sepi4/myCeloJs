import React from 'react'
import moduleStyle from './NavCheckBox.module.css'

export default function NavCheckbox({ text, handler, checked }) {

    const id = Math.random().toString()

    return <span className={moduleStyle.span}>
        <input
            className={moduleStyle.input}
            onChange={handler}
            defaultChecked={checked}
            id={id}
            type='checkbox'
        />

        <label
            className={moduleStyle.label}
            htmlFor={id}
        >
            {text}
        </label>
    </span>

}
