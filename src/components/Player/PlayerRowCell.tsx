import { JSX } from 'react'

import styles from './PlayerRowCell.module.css'

interface Props {
    children: JSX.Element | null
    width: string
    justifyContent?: string
}

function PlayerRowCell(props: Props) {
    return (
        <span
            className={styles.span}
            style={{
                width: props.width,
                justifyContent: props.justifyContent ? props.justifyContent : 'center',
            }}
        >
            {props.children}
        </span>
    )
}
export default PlayerRowCell
