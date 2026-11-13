import { JSX } from 'react'

import styles from './SettingsSection.module.css'

interface Props {
    title?: string
    children?: JSX.Element | JSX.Element[]
    testId?: string
}

function SettingsSection(props: Props) {
    return (
        <div className={styles.section}>
            {props.title && (
                <div data-testid={props.testId} className={styles.title}>
                    {props.title}
                </div>
            )}
            <div className={styles.content}>{props.children}</div>
        </div>
    )
}

export default SettingsSection
