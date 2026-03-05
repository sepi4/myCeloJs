interface ElectronAPI {
    appVersion: string
    settingsDir: string
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
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}

export {}
