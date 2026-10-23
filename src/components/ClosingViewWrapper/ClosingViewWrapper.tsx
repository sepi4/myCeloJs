import { faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { JSX } from 'react'

import useEsc from '../../hooks/useEsc'
import { useViewStore } from '../../stores/viewStore'
import Icon from '../Icon'
import styles from './ViewWrapper.module.css'

interface BackButton {
    title: string
    onClick: () => void
}

interface Props {
    children: JSX.Element | JSX.Element[]
    back?: BackButton
}

export default function ViewWrapper(props: Props) {
    const { setView } = useViewStore()

    const handleToMainView = () => {
        setView('main')
    }

    useEsc(handleToMainView)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {props.back && (
                    <button
                        type="button"
                        className={styles.backButton}
                        data-testid="back-button"
                        title={props.back.title}
                        onClick={props.back.onClick}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                )}
                <Icon fun={handleToMainView} icon={faTimes} testId="close-button" />
            </div>
            {props.children}
        </div>
    )
}
