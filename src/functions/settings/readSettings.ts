export async function readSettings(fileLocation: string, callback: (d: string) => void) {
    const data = await window.electronAPI.settings.read(fileLocation)
    if (data) {
        callback(data)
    }
}
