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
`

function RadioButton({ checked, handler, labelText }) {
    const id = Math.random().toString()

    return <Span>
        <input
            style={{ marginRight: '.5em' }}
            type='radio'
            id={id}
            checked={checked}
            value={labelText}
            onChange={e => handler(e)}
        />
        <label htmlFor={id}>{labelText}</label>
    </Span>
}

export default RadioButton