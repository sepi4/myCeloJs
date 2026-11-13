import { updateSettings } from '../../functions/settings/writeSettings'
import useText from '../../hooks/useText'
import { useSettingsStore } from '../../stores/settingsStore'
import Choice from '../Choice'
import CopyableText from './CopyableText'
import RadioFieldset from './RadioFieldset'
import SettingsLocation from './SettingsLocation'
import SettingsSection from './SettingsSection'

export default function SettingsAfterLog() {
    const getText = useText()
    const { settings } = useSettingsStore()

    const handleType = (format: 'html' | 'txt') => {
        updateSettings({
            rankingsHtml: format === 'html',
            rankingsPort: window.electronAPI.overlayPort,
        })
        window.electronAPI.rankings.setFormat(format)
    }

    const handleOrientation = (horizontal: boolean) => {
        updateSettings({ rankingsHorizontal: horizontal })
    }

    const overlayConfigured =
        settings?.rankingsPort !== undefined &&
        settings.rankingsHorizontal !== undefined &&
        settings.rankingsHtml !== undefined

    const overlayUrl = overlayConfigured ? `http://localhost:${settings.rankingsPort}` : undefined

    if (settings && (settings.logLocationCoh2 || settings.logLocationCoh3)) {
        return (
            <>
                <SettingsSection title={getText('rankings_file_title')}>
                    <RadioFieldset title={getText('format')}>
                        <Choice
                            type="radio"
                            testId="radio-html"
                            label="html"
                            checked={settings.rankingsHtml === true}
                            onChange={() => handleType('html')}
                        />
                        <Choice
                            type="radio"
                            testId="radio-txt"
                            label="txt"
                            checked={settings.rankingsHtml === false}
                            onChange={() => handleType('txt')}
                        />
                    </RadioFieldset>

                    <RadioFieldset title={getText('orientation')}>
                        <Choice
                            type="radio"
                            testId="radio-horizontal"
                            label={getText('horizontal')}
                            checked={settings.rankingsHorizontal === true}
                            onChange={() => handleOrientation(true)}
                        />
                        <Choice
                            type="radio"
                            label={getText('vertical')}
                            checked={settings.rankingsHorizontal === false}
                            onChange={() => handleOrientation(false)}
                        />
                    </RadioFieldset>

                    <CopyableText testId="copy-rankings" text={overlayUrl} />
                </SettingsSection>

                <SettingsLocation
                    fileTypeSet={overlayConfigured}
                    title={getText('settings_file_location_title')}
                />
            </>
        )
    }

    // if log-file not set
    return (
        <SettingsSection title={getText('settings_file_location_title')}>
            <p style={{ color: 'var(--text-danger)' }}>{getText('log_location_first')}</p>
        </SettingsSection>
    )
}
