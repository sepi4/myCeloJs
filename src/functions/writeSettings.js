import fs from 'fs'
import e from 'electron'

const settingsDir = e.remote.app.getPath('userData')

function writeSettings(newSettings, dispatch) {
    fs.writeFile(
        settingsDir + '/settings.json',
        JSON.stringify(newSettings, null, 4),
        'utf-8',
        () => {
            dispatch({
                type: 'SET_SETTINGS',
                data: newSettings,
            })
        },
    )
}

export default writeSettings