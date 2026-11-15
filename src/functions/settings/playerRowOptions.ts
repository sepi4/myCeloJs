import { SettingsType } from '../../types'

/** The player row options from the settings, shared by the rows and their settings section. */
export function playerRowOptions(settings: SettingsType | null | undefined) {
    return {
        showCountry: settings?.playerRowShowCountry !== false,
        showAvatar: settings?.playerRowShowAvatar === true,
    }
}
