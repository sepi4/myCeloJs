import { useLogCheckIntervalStore } from './logCheckIntervalStore'

beforeEach(() => {
    localStorage.clear()
    useLogCheckIntervalStore.setState({ logCheckInterval: 3 })
})

async function loadStore() {
    vi.resetModules()
    return (await import('./logCheckIntervalStore')).useLogCheckIntervalStore
}

describe('logCheckIntervalStore on load', () => {
    test('defaults to 3 when nothing is saved', async () => {
        expect((await loadStore()).getState().logCheckInterval).toBe(3)
    })

    test('uses the saved value', async () => {
        localStorage.setItem('logCheckInterval', '7')
        expect((await loadStore()).getState().logCheckInterval).toBe(7)
    })
})

describe('logCheckIntervalStore', () => {
    test('setLogCheckInterval updates the value', () => {
        useLogCheckIntervalStore.getState().setLogCheckInterval(10)
        expect(useLogCheckIntervalStore.getState().logCheckInterval).toBe(10)
    })

    test('setLogCheckInterval persists to localStorage', () => {
        useLogCheckIntervalStore.getState().setLogCheckInterval(5)
        expect(JSON.parse(localStorage.getItem('logCheckInterval')!)).toBe(5)
    })
})
