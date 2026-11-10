import { JSX } from 'react'

import useEsc from '../../hooks/useEsc'
import { useNavigationStore } from '../../stores/navigationStore'
import Icon from '../Icon'
import { faTimes } from '../icons'

import styles from './ViewWrapper.module.css'

export default function ViewWrapper(props: { children: JSX.Element | JSX.Element[] }) {
    const closeView = useNavigationStore((s) => s.closeView)

    useEsc(closeView)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Icon fun={closeView} icon={faTimes} testId="close-button" />
            </div>
            {props.children}
        </div>
    )
}
