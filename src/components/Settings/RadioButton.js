import React from 'react'
import styled from 'styled-components'

const Span = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1em;
    &:hover {
        color: #ddd;
    }
    input {
        margin-right: .5em;
    }
`

function RadioButton({ checked, handler, labelText, value }) {
    const id = Math.random().toString()

    return <Span>
        <input
            type='radio'
            id={id}
            checked={checked}
            value={value}
            onChange={e => handler(e)}
        />
        <label htmlFor={id}>{labelText}</label>
    </Span>
}

export default RadioButton