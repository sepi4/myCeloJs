import { SettingsType } from '../../types'

export function isOverlayConfigured(settings: SettingsType | null): settings is SettingsType & {
    rankingsPort: number
    rankingsHorizontal: boolean
    rankingsHtml: boolean
} {
    return (
        settings?.rankingsPort !== undefined &&
        settings.rankingsHorizontal !== undefined &&
        settings.rankingsHtml !== undefined
    )
}
