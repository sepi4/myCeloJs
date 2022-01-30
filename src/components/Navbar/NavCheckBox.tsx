import React from 'react'

import { Checkbox, Switch } from '@mui/material'
import moduleStyle from './NavCheckBox.module.css'

interface Props {
    text?: string
    handler: () => void
    checked: boolean
}

export default function NavCheckbox(props: Props) {
    const id = Math.random().toString()

    return (
        <span className={moduleStyle.span}>
            <span
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Checkbox
                    size="small"
                    id={id}
                    onChange={props.handler}
                    checked={props.checked}
                    title={props.text}
                />

                <label className={moduleStyle.label} htmlFor={id}>
                    {props.text}
                </label>
            </span>
        </span>
    )
}
