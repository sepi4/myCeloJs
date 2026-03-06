import SettingsDiv from './SettingsDiv'
import CopyDiv from './CopyDiv'

interface Props {
    fileTypeSet: boolean
    title?: string
}

export default function SettingsLocation(props: Props) {
    if (props.fileTypeSet) {
        return (
            <SettingsDiv title={props.title}>
                <CopyDiv
                    text={window.electronAPI.settingsDir + '\\settings.json'}
                />
            </SettingsDiv>
        )
    }

    return null
}
