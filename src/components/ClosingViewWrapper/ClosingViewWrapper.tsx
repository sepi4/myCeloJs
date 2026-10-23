import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { JSX } from 'react'

import useEsc from '../../hooks/useEsc'
import { useViewStore } from '../../stores/viewStore'
import Icon from '../Icon'
import styles from './ViewWrapper.module.css'

interface NavButton {
    title: string
    enabled: boolean
    onClick: () => void
}

interface Props {
    children: JSX.Element | JSX.Element[]
    navigation?: { back: NavButton; forward: NavButton }
}

function NavigationButton(props: { button: NavButton; icon: IconDefinition; testId: string }) {
    // A disabled button stays in place but invisible, so the other one never moves.
    return (
        <button
            type="button"
            className={
                props.button.enabled ? styles.navButton : `${styles.navButton} ${styles.hidden}`
            }
            data-testid={props.testId}
            title={props.button.title}
            disabled={!props.button.enabled}
            onClick={props.button.onClick}
        >
            <FontAwesomeIcon icon={props.icon} />
        </button>
    )
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
                {props.navigation && (
                    <>
                        <NavigationButton
                            button={props.navigation.back}
                            icon={faArrowLeft}
                            testId="back-button"
                        />
                        <NavigationButton
                            button={props.navigation.forward}
                            icon={faArrowRight}
                            testId="forward-button"
                        />
                    </>
                )}
                <Icon fun={handleToMainView} icon={faTimes} testId="close-button" />
            </div>
            {props.children}
        </div>
    )
}
