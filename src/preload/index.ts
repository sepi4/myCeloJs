import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'

const appInfo = ipcRenderer.sendSync('get-app-info') as {
    version: string
    settingsDir: string
    appLocation: string
    pathSep: string
}

export interface UpdateStatus {
    status: 'available' | 'downloaded' | 'error'
    version?: string
}

// ipcRenderer.invoke returns Promise<any>, so each call states what its handler in main returns.
const api = {
    appVersion: appInfo.version,
    settingsDir: appInfo.settingsDir,
    appLocation: appInfo.appLocation,
    pathSep: appInfo.pathSep,
    dialog: {
        showOpenDialog: (
            options: Electron.OpenDialogOptions
        ): Promise<Electron.OpenDialogReturnValue> =>
            ipcRenderer.invoke('dialog:show-open', options),
    },
    shell: {
        openExternal: (url: string): Promise<void> =>
            ipcRenderer.invoke('shell:open-external', url),
    },
    settings: {
        read: (filePath: string): Promise<string | null> =>
            ipcRenderer.invoke('settings:read', filePath),
        write: (filePath: string, data: string): Promise<void> =>
            ipcRenderer.invoke('settings:write', filePath, data),
    },
    log: {
        read: (filePath: string): Promise<string | null> =>
            ipcRenderer.invoke('log:read', filePath),
    },
    steam: {
        fetchAvatar: (steamId: string): Promise<string | null> =>
            ipcRenderer.invoke('steam:fetch-avatar', steamId),
    },
    overlayPort: ipcRenderer.sendSync('get-overlay-port') as number,
    rankings: {
        write: (jsonContent: string, txtContent: string): Promise<void> =>
            ipcRenderer.invoke('rankings:write', jsonContent, txtContent),
        setFormat: (format: 'html' | 'txt'): Promise<void> =>
            ipcRenderer.invoke('rankings:set-format', format),
    },
    updater: {
        onStatus: (callback: (status: UpdateStatus) => void) => {
            const listener = (_e: IpcRendererEvent, status: UpdateStatus) => callback(status)
            ipcRenderer.on('updater:status', listener)
            return () => {
                ipcRenderer.removeListener('updater:status', listener)
            }
        },
        download: (): Promise<void> => ipcRenderer.invoke('updater:download'),
        install: (): Promise<void> => ipcRenderer.invoke('updater:install'),
    },
}

contextBridge.exposeInMainWorld('electronAPI', api)

export type ElectronAPI = typeof api
