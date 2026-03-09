interface ElectronAPI {
    appVersion: string
    settingsDir: string
    appLocation: string
    pathSep: string
    dialog: {
        showOpenDialog(options: {
            properties?: string[]
            filters?: { name: string; extensions: string[] }[]
        }): Promise<{ filePaths: string[]; canceled: boolean }>
    }
    clipboard: {
        writeText(text: string): void
    }
    shell: {
        openExternal(url: string): Promise<void>
    }
    settings: {
        read(filePath: string): Promise<string | null>
        write(filePath: string, data: string): Promise<void>
    }
    log: {
        read(filePath: string): Promise<string | null>
    }
    rankings: {
        write(jsonContent: string, txtContent: string): Promise<void>
    }
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}

export {}
