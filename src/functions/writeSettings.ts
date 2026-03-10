import { useSettingsStore } from '../stores/settingsStore'
import { SettingsType } from '../types'

const settingsDir = window.electronAPI.settingsDir

function writeSettings(newSettings: SettingsType) {
    window.electronAPI.settings
        .write(settingsDir + '/settings.json', JSON.stringify(newSettings, null, 4))
        .then(() => {
            useSettingsStore.getState().setSettings(newSettings)
        })
}

export default writeSettings
