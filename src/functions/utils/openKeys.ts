/**
 * Helpers for lists of open items (players, team ranks) stored by their keys.
 * A "toggle all" button has no state of its own: it is open when any of its
 * items is open, so it can never disagree with what is shown.
 */

/** Opens a closed key or closes an open one. */
export function toggleKey<T>(open: T[], key: T): T[] {
    return open.includes(key) ? open.filter((k) => k !== key) : [...open, key]
}

/** True when any of the given keys is open. */
export function anyKeyOpen<T>(open: T[], keys: T[]): boolean {
    return keys.some((k) => open.includes(k))
}

/** Closes all given keys when any of them is open, otherwise opens them all. */
export function toggleKeys<T>(open: T[], keys: T[]): T[] {
    if (anyKeyOpen(open, keys)) {
        return open.filter((k) => !keys.includes(k))
    }
    return [...open, ...keys.filter((k) => !open.includes(k))]
}
