import React, { ChangeEvent } from 'react'
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
        margin-right: 0.5em;
    }
`

interface Props {
    checked: boolean
    handler: (e: ChangeEvent<HTMLInputElement>) => void
    labelText?: string
    value: string
}

function RadioButton(props: Props) {
    const id = Math.random().toString()

    return (
        <Span>
            <input
                type="radio"
                id={id}
                checked={props.checked}
                value={props.value}
                onChange={(e) => props.handler(e)}
            />
            <label htmlFor={id}>{props.labelText}</label>
        </Span>
    )
}

export default RadioButton
