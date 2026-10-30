// Unit tests run in Node, which has no working localStorage. This follows the
// Web Storage rules the stores rely on: values become strings and a missing key
// returns null.
class MemoryStorage implements Storage {
    private items = new Map<string, string>()

    get length(): number {
        return this.items.size
    }

    clear(): void {
        this.items.clear()
    }

    getItem(key: string): string | null {
        return this.items.get(String(key)) ?? null
    }

    key(index: number): string | null {
        return [...this.items.keys()][index] ?? null
    }

    removeItem(key: string): void {
        this.items.delete(String(key))
    }

    setItem(key: string, value: string): void {
        this.items.set(String(key), String(value))
    }
}

Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoryStorage(),
    configurable: true,
})
