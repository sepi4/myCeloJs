import React from 'react'
import styles from './MainRowSpan.module.css'

function MainRowSpan({ children, width, justifyContent }) {
    return <span
        className={styles.span}
        style={{
            width,
            justifyContent: justifyContent ? justifyContent : 'center',
        }}
    >
        {children}
    </span>
}
export default MainRowSpan