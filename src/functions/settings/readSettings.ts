import { SettingsType } from '../../types'

const settingsFile = window.electronAPI.settingsDir + '/settings.json'

export function withDefaults(saved: Partial<SettingsType>): SettingsType {
    return {
        ...saved,
        appLocation: window.electronAPI.appLocation,
        navbarPosition: saved.navbarPosition ?? 'top',
        fontSize: saved.fontSize ?? 'small',
        theme: saved.theme === 'light' ? 'light' : 'dark',
    }
}

export async function readSettings(): Promise<SettingsType | null> {
    const data = await window.electronAPI.settings.read(settingsFile)
    if (!data) {
        return null
    }
    const settings = withDefaults(JSON.parse(data))
    // The overlay server may get a different port on each start
    if (settings.rankingsPort) {
        settings.rankingsPort = window.electronAPI.overlayPort
    }
    return settings
}
