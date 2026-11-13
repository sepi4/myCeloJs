import { updateSettings } from '../../functions/settings/writeSettings'
import useText from '../../hooks/useText'
import { useSettingsStore } from '../../stores/settingsStore'
import CopyableText from './CopyableText'
import RadioGroup from './RadioGroup'
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
                    <RadioGroup
                        compact
                        title={getText('format')}
                        name="rankingsFormat"
                        testIdPrefix="radio"
                        options={['html', 'txt'] as const}
                        selected={
                            settings.rankingsHtml === undefined
                                ? undefined
                                : settings.rankingsHtml
                                  ? 'html'
                                  : 'txt'
                        }
                        getLabel={(format) => format}
                        onChange={handleType}
                    />

                    <RadioGroup
                        compact
                        title={getText('orientation')}
                        name="rankingsOrientation"
                        testIdPrefix="radio"
                        options={['horizontal', 'vertical'] as const}
                        selected={
                            settings.rankingsHorizontal === undefined
                                ? undefined
                                : settings.rankingsHorizontal
                                  ? 'horizontal'
                                  : 'vertical'
                        }
                        getLabel={(orientation) => getText(orientation)}
                        onChange={(orientation) => handleOrientation(orientation === 'horizontal')}
                    />

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
