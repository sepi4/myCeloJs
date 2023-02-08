import electron from 'electron'
const { clipboard } = electron.remote

import Notification from '../Notification'

import { StyledButton } from '../styled/styledSettings'
import styles from './Settings.module.css'

import useTimedBoolean from '../../hooks/useTimedBoolean'

import getText from '../../functions/getText'
import { useAppSelector } from '../../hooks/customReduxHooks'
import { SettingsType } from '../../types'

interface Props {
    text?: string
}

function CopyDiv(props: Props) {
    const settings: SettingsType = useAppSelector((state) => state.settings)

    const [timed, setTimed] = useTimedBoolean(1000)
    const handleCopy = () => {
        if (props.text) {
            setTimed(true)
            clipboard.writeText(props.text)
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
