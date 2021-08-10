import React from 'react'
import styles from './NavbarRow.module.css'

export default function NavbarRow({ children, fontSize }) {
    return <div className={styles.row} style={{
        fontSize,
    }}>
        {children}
    </div>
}