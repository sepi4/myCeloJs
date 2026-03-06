import Notification from '../Notification'

import { StyledButton } from '../styled/styledSettings'
import styles from './Settings.module.css'

import useTimedBoolean from '../../hooks/useTimedBoolean'

import getText from '../../functions/getText'
import { useSettingsStore } from '../../stores/settingsStore'

interface Props {
    text?: string
}

function CopyDiv(props: Props) {
    const { settings } = useSettingsStore()

    const [timed, setTimed] = useTimedBoolean(1000)
    const handleCopy = () => {
        if (props.text) {
            setTimed(true)
            window.electronAPI.clipboard.writeText(props.text)
        }
    }

    if (!props.text) {
        return null
    }
    const notification = timed ? (
        <Notification text={getText('copied', settings)} />
    ) : null

    return (
        <div>
            <div className={styles.textDiv}>
                {props.text}
                {notification}
            </div>

            <StyledButton onClick={handleCopy}>
                {getText('copy', settings)}
            </StyledButton>
        </div>
    )
}

export default CopyDiv
