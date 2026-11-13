import { JSX } from 'react'

import styles from './RadioFieldset.module.css'

interface Props {
    title?: string
    children?: JSX.Element[]
}
function RadioFieldset(props: Props) {
    return (
        <>
            <div className={styles.title}>{props.title}</div>

            <form className={styles.form}>{props.children}</form>
        </>
    )
}

export default RadioFieldset
