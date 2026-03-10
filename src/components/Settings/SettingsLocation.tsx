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
                    testId="copy-settings"
                    text={
                        window.electronAPI.settingsDir +
                        window.electronAPI.pathSep +
                        'settings.json'
                    }
                />
            </SettingsDiv>
        )
    }

    return null
}
