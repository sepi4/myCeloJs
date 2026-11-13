import CopyableText from './CopyableText'
import SettingsSection from './SettingsSection'

interface Props {
    fileTypeSet: boolean
    title?: string
}

export default function SettingsLocation(props: Props) {
    if (props.fileTypeSet) {
        return (
            <SettingsSection title={props.title}>
                <CopyableText
                    testId="copy-settings"
                    text={
                        window.electronAPI.settingsDir +
                        window.electronAPI.pathSep +
                        'settings.json'
                    }
                />
            </SettingsSection>
        )
    }

    return null
}
