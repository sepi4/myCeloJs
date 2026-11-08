import { JSX } from 'react'

import styles from './RadioButtonsDiv.module.css'

interface Props {
    title?: string
    children?: JSX.Element[]
}
function RadioButtonsDiv(props: Props) {
    return (
        <>
            <div className={styles.title}>{props.title}</div>

            <form className={styles.form}>{props.children}</form>
        </>
    )
}

export default RadioButtonsDiv
