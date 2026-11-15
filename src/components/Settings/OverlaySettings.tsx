import { isOverlayConfigured } from '../../functions/settings/isOverlayConfigured'
import { updateSettings } from '../../functions/settings/writeSettings'
import useText from '../../hooks/useText'
import { useSettingsStore } from '../../stores/settingsStore'
import CheckboxGroup from './CheckboxGroup'
import CopyableText from './CopyableText'
import OverlayPreview from './OverlayPreview'
import RadioGroup from './RadioGroup'
import SettingsSection from './SettingsSection'

import styles from './Settings.module.css'

export default function OverlaySettings() {
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

    const showCountry = settings?.rankingsShowCountry !== false
    const showAvatar = settings?.rankingsShowAvatar === true

    const overlayUrl = isOverlayConfigured(settings)
        ? `http://localhost:${settings.rankingsPort}`
        : undefined

    if (!settings?.logLocationCoh2 && !settings?.logLocationCoh3) {
        return null
    }

    return (
        <SettingsSection title={getText('rankings_file_title')}>
            <div className={styles.overlayRow}>
                <div className={styles.overlayControls}>
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

                    <CheckboxGroup
                        title={getText('overlay_show')}
                        options={[
                            {
                                label: getText('country'),
                                checked: showCountry,
                                onChange: () =>
                                    updateSettings({ rankingsShowCountry: !showCountry }),
                                testId: 'checkbox-overlay-country',
                            },
                            {
                                label: getText('avatar'),
                                checked: showAvatar,
                                onChange: () => updateSettings({ rankingsShowAvatar: !showAvatar }),
                                testId: 'checkbox-overlay-avatar',
                                disabled: settings.rankingsHtml === false,
                                title:
                                    settings.rankingsHtml === false
                                        ? getText('avatar_html_only')
                                        : undefined,
                            },
                        ]}
                    />

                    <CopyableText
                        testId="copy-rankings"
                        title={getText('overlay_url_title')}
                        text={overlayUrl}
                    />
                </div>

                {overlayUrl && (
                    <OverlayPreview
                        url={overlayUrl}
                        horizontal={settings.rankingsHorizontal === true}
                        html={settings.rankingsHtml === true}
                        showCountry={showCountry}
                        showAvatar={showAvatar}
                    />
                )}
            </div>
        </SettingsSection>
    )
}
