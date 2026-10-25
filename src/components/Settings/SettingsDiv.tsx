import { JSX } from 'react'

import styles from './SettingsDiv.module.css'

interface Props {
    title?: string
    children?: JSX.Element | JSX.Element[]
    testId?: string
}

function SettingsDiv(props: Props) {
    return (
        <div className={styles.settingsDiv}>
            {props.title && (
                <div
                    data-testid={props.testId}
                    style={{
                        fontWeight: 'bold',
                        fontSize: '100%',
                    }}
                >
                    {props.title}
                </div>
            )}
            <div className={styles.contentDiv}>{props.children}</div>
        </div>
    )
}

export default SettingsDiv
