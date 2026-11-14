import { useAlertStore } from './alertStore'

beforeEach(() => {
    localStorage.clear()
    useAlertStore.setState({ alert: false })
})

async function loadStore() {
    vi.resetModules()
    return (await import('./alertStore')).useAlertStore
}

describe('alertStore on load', () => {
    test('defaults to false when nothing is saved', async () => {
        expect((await loadStore()).getState().alert).toBe(false)
    })

    test('uses the saved value', async () => {
        localStorage.setItem('alert', 'true')
        expect((await loadStore()).getState().alert).toBe(true)
    })
})

describe('alertStore', () => {
    test('toggleAlert flips the value', () => {
        useAlertStore.getState().toggleAlert()
        expect(useAlertStore.getState().alert).toBe(true)

        useAlertStore.getState().toggleAlert()
        expect(useAlertStore.getState().alert).toBe(false)
    })

    test('toggleAlert persists to localStorage', () => {
        useAlertStore.getState().toggleAlert()
        expect(JSON.parse(localStorage.getItem('alert')!)).toBe(true)
    })
})
