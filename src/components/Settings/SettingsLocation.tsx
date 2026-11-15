import useText from '../../hooks/useText'
import { useSettingsStore } from '../../stores/settingsStore'
import CopyableText from './CopyableText'
import SettingsSection from './SettingsSection'

export default function SettingsLocation() {
    const getText = useText()
    const { settings } = useSettingsStore()

    if (!settings?.logLocationCoh2 && !settings?.logLocationCoh3) {
        return (
            <SettingsSection title={getText('settings_file_location_title')}>
                <p style={{ color: 'var(--text-danger)' }}>{getText('log_location_first')}</p>
            </SettingsSection>
        )
    }

    return (
        <SettingsSection title={getText('settings_file_location_title')}>
            <CopyableText
                testId="copy-settings"
                text={window.electronAPI.settingsDir + window.electronAPI.pathSep + 'settings.json'}
            />
        </SettingsSection>
    )
}
