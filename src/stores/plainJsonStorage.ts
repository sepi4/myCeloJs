import { PersistStorage } from 'zustand/middleware'

/**
 * Keeps one field of a store in localStorage as plain JSON under the store's name.
 * zustand's own storage wraps the state in `{ state, version }` and could not read
 * the values that earlier app versions saved.
 */
export function plainJsonStorage<K extends string, V>(field: K): PersistStorage<Record<K, V>> {
    return {
        getItem: (name) => {
            const stored = localStorage.getItem(name)
            if (stored === null) {
                return null
            }
            return { state: { [field]: JSON.parse(stored) } as Record<K, V> }
        },
        setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value.state[field]))
        },
        removeItem: (name) => {
            localStorage.removeItem(name)
        },
    }
}
