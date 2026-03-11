import { useSettingsStore } from '../stores/settingsStore'
import { SettingsType } from '../types'

const settingsDir = window.electronAPI.settingsDir

async function writeSettings(newSettings: SettingsType) {
    await window.electronAPI.settings.write(
        settingsDir + '/settings.json',
        JSON.stringify(newSettings, null, 4)
    )
    useSettingsStore.getState().setSettings(newSettings)
}

export default writeSettings
