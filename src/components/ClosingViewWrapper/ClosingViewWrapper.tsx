import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { JSX } from 'react'

import useEsc from '../../hooks/useEsc'
import { useViewStore } from '../../stores/viewStore'
import Icon from '../Icon'
import styles from './ViewWrapper.module.css'

interface Props {
    children: JSX.Element | JSX.Element[]
}

export default function ViewWrapper(props: Props) {
    const { setView } = useViewStore()

    const handleToMainView = () => {
        setView('main')
    }

    useEsc(handleToMainView)

    return (
        <div className={styles.container}>
            <Icon fun={handleToMainView} icon={faTimes} testId="close-button" />
            {props.children}
        </div>
    )
}
