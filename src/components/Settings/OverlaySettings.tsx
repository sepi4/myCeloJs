import { isOverlayHorizontal, isOverlayHtml } from '../../functions/rankings/rankingsOptions'
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

    if (!settings?.logLocationCoh2 && !settings?.logLocationCoh3) {
        return null
    }

    const overlayUrl = `http://localhost:${window.electronAPI.overlayPort}`

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
                        selected={isOverlayHtml(settings) ? 'html' : 'txt'}
                        getLabel={(format) => format}
                        onChange={handleType}
                    />

                    <RadioGroup
                        compact
                        title={getText('orientation')}
                        name="rankingsOrientation"
                        testIdPrefix="radio"
                        options={['horizontal', 'vertical'] as const}
                        selected={isOverlayHorizontal(settings) ? 'horizontal' : 'vertical'}
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
                                disabled: !isOverlayHtml(settings),
                                title: isOverlayHtml(settings)
                                    ? undefined
                                    : getText('avatar_html_only'),
                            },
                        ]}
                    />

                    <CopyableText
                        testId="copy-rankings"
                        title={getText('overlay_url_title')}
                        text={overlayUrl}
                    >
                        <button
                            className={styles.button}
                            data-testid="open-overlay-button"
                            onClick={() => window.electronAPI.shell.openExternal(overlayUrl)}
                        >
                            {getText('browser')}
                        </button>
                    </CopyableText>
                </div>

                <OverlayPreview url={overlayUrl} settings={settings} />
            </div>
        </SettingsSection>
    )
}
