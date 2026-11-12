import { useSettingsStore } from '../../stores/settingsStore'
import { SettingsType } from '../../types'
import { withDefaults } from './readSettings'

const settingsDir = window.electronAPI.settingsDir

async function writeSettings(newSettings: SettingsType) {
    await window.electronAPI.settings.write(
        settingsDir + '/settings.json',
        JSON.stringify(newSettings, null, 4)
    )
    useSettingsStore.getState().setSettings(newSettings)
}

export function updateSettings(patch: Partial<SettingsType>) {
    const current = useSettingsStore.getState().settings ?? withDefaults({})
    return writeSettings({ ...current, ...patch })
}

export default writeSettings
