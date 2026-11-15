import { updateSettings } from '../../functions/settings/writeSettings'
import useText from '../../hooks/useText'
import { useSettingsStore } from '../../stores/settingsStore'
import CheckboxGroup from './CheckboxGroup'
import PlayerRowPreview from './PlayerRowPreview'
import SettingsSection from './SettingsSection'

import styles from './Settings.module.css'

export default function PlayerRowSettings() {
    const getText = useText()
    const { settings } = useSettingsStore()

    const showCountry = settings?.playerRowShowCountry !== false
    const showAvatar = settings?.playerRowShowAvatar === true

    return (
        <SettingsSection title={getText('player_row_title')}>
            <div className={styles.overlayRow}>
                <div className={styles.overlayControls}>
                    <CheckboxGroup
                        title={getText('overlay_show')}
                        options={[
                            {
                                label: getText('country'),
                                checked: showCountry,
                                onChange: () =>
                                    updateSettings({ playerRowShowCountry: !showCountry }),
                                testId: 'checkbox-player-row-country',
                            },
                            {
                                label: getText('avatar'),
                                checked: showAvatar,
                                onChange: () =>
                                    updateSettings({ playerRowShowAvatar: !showAvatar }),
                                testId: 'checkbox-player-row-avatar',
                            },
                        ]}
                    />
                </div>

                <PlayerRowPreview />
            </div>
        </SettingsSection>
    )
}
