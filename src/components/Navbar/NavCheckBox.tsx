import { useId } from 'react'

import moduleStyle from './NavCheckBox.module.css'

interface Props {
    text?: string
    handler: () => void
    checked: boolean
    testId?: string
    title?: string
}

export default function NavCheckbox(props: Props) {
    const id = useId()

    return (
        <span className={moduleStyle.span} title={props.title}>
            <input
                className={moduleStyle.input}
                onChange={props.handler}
                defaultChecked={props.checked}
                id={id}
                type="checkbox"
            />

            <label data-testid={props.testId} className={moduleStyle.label} htmlFor={id}>
                {props.text}
            </label>
        </span>
    )
}
