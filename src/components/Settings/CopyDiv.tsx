import getText from '../../functions/getText'
import useTimedBoolean from '../../hooks/useTimedBoolean'
import { useSettingsStore } from '../../stores/settingsStore'
import Notification from '../Notification'
import styles from './Settings.module.css'

interface Props {
    text?: string
    testId?: string
}

function CopyDiv(props: Props) {
    const { settings } = useSettingsStore()

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
            text={getText('copied', settings)}
        />
    ) : null

    return (
        <div data-testid={props.testId}>
            <div className={styles.textDiv}>
                {props.text}
                {notification}
            </div>

            <button
                className={styles.button}
                data-testid={props.testId ? `${props.testId}-button` : undefined}
                onClick={handleCopy}
            >
                {getText('copy', settings)}
            </button>
        </div>
    )
}

export default CopyDiv
