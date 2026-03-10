import { contextBridge, ipcRenderer } from 'electron'

const appInfo = ipcRenderer.sendSync('get-app-info') as {
    version: string
    settingsDir: string
    appLocation: string
    pathSep: string
}

contextBridge.exposeInMainWorld('electronAPI', {
    appVersion: appInfo.version,
    settingsDir: appInfo.settingsDir,
    appLocation: appInfo.appLocation,
    pathSep: appInfo.pathSep,
    dialog: {
        showOpenDialog: (options: Electron.OpenDialogOptions) =>
            ipcRenderer.invoke('dialog:show-open', options),
    },
    shell: {
        openExternal: (url: string) => ipcRenderer.invoke('shell:open-external', url),
    },
    settings: {
        read: (filePath: string) => ipcRenderer.invoke('settings:read', filePath),
        write: (filePath: string, data: string) =>
            ipcRenderer.invoke('settings:write', filePath, data),
    },
    log: {
        read: (filePath: string) => ipcRenderer.invoke('log:read', filePath),
    },
    rankings: {
        write: (jsonContent: string, txtContent: string) =>
            ipcRenderer.invoke('rankings:write', jsonContent, txtContent),
    },
})
