import { useAutoLogCheckingStore } from './autoLogCheckingStore'

beforeEach(() => {
    localStorage.clear()
    useAutoLogCheckingStore.setState({ autoLogChecking: true })
})

async function loadStore() {
    vi.resetModules()
    return (await import('./autoLogCheckingStore')).useAutoLogCheckingStore
}

describe('autoLogCheckingStore on load', () => {
    test('defaults to true when nothing is saved', async () => {
        expect((await loadStore()).getState().autoLogChecking).toBe(true)
    })

    test('uses the saved value', async () => {
        localStorage.setItem('autoLogChecking', 'false')
        expect((await loadStore()).getState().autoLogChecking).toBe(false)
    })
})

describe('autoLogCheckingStore', () => {
    test('toggleAutoLogChecking flips the value', () => {
        useAutoLogCheckingStore.getState().toggleAutoLogChecking()
        expect(useAutoLogCheckingStore.getState().autoLogChecking).toBe(false)

        useAutoLogCheckingStore.getState().toggleAutoLogChecking()
        expect(useAutoLogCheckingStore.getState().autoLogChecking).toBe(true)
    })

    test('toggleAutoLogChecking persists to localStorage', () => {
        useAutoLogCheckingStore.getState().toggleAutoLogChecking()
        expect(JSON.parse(localStorage.getItem('autoLogChecking')!)).toBe(false)
    })
})
