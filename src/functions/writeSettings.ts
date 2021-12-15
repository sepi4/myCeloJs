import fs from 'fs'
import e from 'electron'
import { Settings } from '../types'

const settingsDir = e.remote.app.getPath('userData')

type D = ({ type, data }: { type: string; data: Settings }) => void

function writeSettings(newSettings: Settings, dispatch: D) {
    fs.writeFile(
        settingsDir + '/settings.json',
        JSON.stringify(newSettings, null, 4),
        'utf-8',
        () => {
            dispatch({
                type: 'SET_SETTINGS',
                data: newSettings,
            })
        }
    )
}

export default writeSettings
