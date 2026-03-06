const { contextBridge, ipcRenderer, clipboard, shell } = require('electron')

const appInfo = ipcRenderer.sendSync('get-app-info')

contextBridge.exposeInMainWorld('electronAPI', {
    appVersion: appInfo.version,
    settingsDir: appInfo.settingsDir,
    appLocation: appInfo.appLocation,
    dialog: {
        showOpenDialog: (options) => ipcRenderer.invoke('dialog:show-open', options),
    },
    clipboard: {
        writeText: (text) => clipboard.writeText(text),
    },
    shell: {
        openExternal: (url) => shell.openExternal(url),
    },
    settings: {
        read: (filePath) => ipcRenderer.invoke('settings:read', filePath),
        write: (filePath, data) => ipcRenderer.invoke('settings:write', filePath, data),
    },
    log: {
        read: (filePath) => ipcRenderer.invoke('log:read', filePath),
    },
    rankings: {
        write: (jsonContent, txtContent) =>
            ipcRenderer.invoke('rankings:write', jsonContent, txtContent),
    },
})
