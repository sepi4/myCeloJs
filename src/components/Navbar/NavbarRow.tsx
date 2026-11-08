import { JSX } from 'react'

import styles from './NavbarRow.module.css'

interface Props {
    children?: JSX.Element | JSX.Element[] | string
    isTop?: boolean
}

export default function NavbarRow(props: Props) {
    return <div className={props.isTop ? styles.rowTop : styles.row}>{props.children}</div>
}
