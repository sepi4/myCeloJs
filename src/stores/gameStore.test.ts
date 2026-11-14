import { useGameStore } from './gameStore'

async function loadStore() {
    vi.resetModules()
    return (await import('./gameStore')).useGameStore
}

beforeEach(() => {
    localStorage.clear()
    useGameStore.setState({ game: 'coh2' })
})

describe('gameStore on load', () => {
    test('defaults to coh2 when nothing is saved', async () => {
        expect((await loadStore()).getState().game).toBe('coh2')
    })

    test('uses the saved game', async () => {
        localStorage.setItem('game', '"coh3"')
        expect((await loadStore()).getState().game).toBe('coh3')
    })

    test('ignores an unknown saved game', async () => {
        localStorage.setItem('game', '"coh4"')
        expect((await loadStore()).getState().game).toBe('coh2')
    })

    test('reads the old navButtons.coh3 flag', async () => {
        localStorage.setItem('navButtons', JSON.stringify({ coh3: true }))
        expect((await loadStore()).getState().game).toBe('coh3')
    })
})

describe('gameStore', () => {
    test('setGame updates the value', () => {
        useGameStore.getState().setGame('coh3')
        expect(useGameStore.getState().game).toBe('coh3')
    })

    test('setGame persists to localStorage', () => {
        useGameStore.getState().setGame('coh3')
        expect(JSON.parse(localStorage.getItem('game')!)).toBe('coh3')
    })
})
