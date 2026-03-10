const { contextBridge, ipcRenderer } = require('electron')

const appInfo = ipcRenderer.sendSync('get-app-info')

contextBridge.exposeInMainWorld('electronAPI', {
    appVersion: appInfo.version,
    settingsDir: appInfo.settingsDir,
    appLocation: appInfo.appLocation,
    pathSep: appInfo.pathSep,
    dialog: {
        showOpenDialog: (options) =>
            ipcRenderer.invoke('dialog:show-open', options),
    },
    shell: {
        openExternal: (url) => ipcRenderer.invoke('shell:open-external', url),
    },
    settings: {
        read: (filePath) => ipcRenderer.invoke('settings:read', filePath),
        write: (filePath, data) =>
            ipcRenderer.invoke('settings:write', filePath, data),
    },
    log: {
        read: (filePath) => ipcRenderer.invoke('log:read', filePath),
    },
    rankings: {
        write: (jsonContent, txtContent) =>
            ipcRenderer.invoke('rankings:write', jsonContent, txtContent),
    },
})
