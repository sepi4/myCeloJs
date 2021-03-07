import React from 'react'

export default function NavCheckbox({ text, handler, checked }) {

    const id = Math.random().toString()

    return <span style={{
        display: 'flex',
        alignItems: 'center',
    }}>

        <input
            onChange={handler}
            defaultChecked={checked}
            id={id}
            type='checkbox'
            style={{
                cursor: 'pointer',
            }}
        />

        <label
            className='checkbox'
            htmlFor={id}
            style={{
                cursor: 'pointer',
                marginLeft: '0.2em',
            }}
        >{text}</label>


    </span>

}
