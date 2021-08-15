export default function getLocalStorage(key, def) {
    const str = localStorage.getItem(key)
    if (str !== undefined && str !== null) {
        return JSON.parse(str)
    }
    return def
}