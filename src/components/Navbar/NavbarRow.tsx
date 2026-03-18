import { JSX } from 'react'

import styles from './NavbarRow.module.css'

interface Props {
    children?: JSX.Element | JSX.Element[] | string
    fontSize?: string
    isTop?: boolean
}

export default function NavbarRow(props: Props) {
    return (
        <div
            className={props.isTop ? styles.rowTop : styles.row}
            style={{
                fontSize: props.fontSize,
            }}
        >
            {props.children}
        </div>
    )
}
