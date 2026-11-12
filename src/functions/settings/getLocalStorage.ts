export default function getLocalStorage<T>(key: string, def: T): T {
    const str = localStorage.getItem(key)
    if (str === null) {
        return def
    }
    try {
        return JSON.parse(str)
    } catch {
        return def
    }
}

export function setLocalStorage(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value))
}
