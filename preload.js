/* eslint-disable @typescript-eslint/no-var-requires */
const { ipcRenderer, clipboard, shell } = require('electron')

const appInfo = ipcRenderer.sendSync('get-app-info')

window.electronAPI = {
    appVersion: appInfo.version,
    settingsDir: appInfo.settingsDir,
    dialog: {
        showOpenDialog: (options) => ipcRenderer.invoke('dialog:show-open', options),
    },
    clipboard: {
        writeText: (text) => clipboard.writeText(text),
    },
    shell: {
        openExternal: (url) => shell.openExternal(url),
    },
}
