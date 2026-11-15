import useText from '../../hooks/useText'
import useTimedBoolean from '../../hooks/useTimedBoolean'
import Notification from '../Notification'

import radioStyles from './RadioGroup.module.css'
import styles from './Settings.module.css'

interface Props {
    text?: string
    testId?: string
    /** Small title above the field, like a compact RadioGroup title. */
    title?: string
}

function CopyableText(props: Props) {
    const getText = useText()

    const [timed, setTimed] = useTimedBoolean(1000)
    const handleCopy = () => {
        if (props.text) {
            setTimed(true)
            navigator.clipboard.writeText(props.text)
        }
    }

    if (!props.text) {
        return null
    }
    const notification = timed ? (
        <Notification
            testId={props.testId ? `${props.testId}-notification` : undefined}
            text={getText('copied')}
        />
    ) : null

    return (
        <div data-testid={props.testId}>
            {props.title && <div className={radioStyles.compactTitle}>{props.title}</div>}
            <div className={styles.textDiv}>
                {props.text}
                {notification}
            </div>

            <button
                className={styles.button}
                data-testid={props.testId ? `${props.testId}-button` : undefined}
                onClick={handleCopy}
            >
                {getText('copy')}
            </button>
        </div>
    )
}

export default CopyableText
