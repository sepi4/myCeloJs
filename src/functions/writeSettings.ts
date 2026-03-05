import { SettingsType } from '../types'

const settingsDir = window.electronAPI.settingsDir

type D = ({ type, data }: { type: string; data: SettingsType }) => void

function writeSettings(newSettings: SettingsType, dispatch: D) {
    window.electronAPI.settings
        .write(settingsDir + '/settings.json', JSON.stringify(newSettings, null, 4))
        .then(() => {
            dispatch({
                type: 'SET_SETTINGS',
                data: newSettings,
            })
        })
}

export default writeSettings
