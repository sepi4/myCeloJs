import { ChangeEvent, useId } from 'react'

import styles from './RadioButton.module.css'

interface Props {
    checked: boolean
    handler: (e: ChangeEvent<HTMLInputElement>) => void
    labelText?: string
    value: string
    testId?: string
}

function RadioButton(props: Props) {
    const id = useId()

    return (
        <span className={styles.span}>
            <input
                type="radio"
                id={id}
                checked={props.checked}
                value={props.value}
                onChange={(e) => props.handler(e)}
            />
            <label data-testid={props.testId} htmlFor={id}>
                {props.labelText}
            </label>
        </span>
    )
}

export default RadioButton
