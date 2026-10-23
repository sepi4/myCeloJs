import { ExtraInfo } from '../types'
import { usePlayerCardStore } from './playerCardStore'
import { useViewStore } from './viewStore'

const extraInfo = (steamId: string) => ({ steamId, ranks: [] }) as unknown as ExtraInfo

function openCard(name: string, coh3 = false) {
    usePlayerCardStore.getState().setPlayerCard({ name }, extraInfo(name), coh3)
    useViewStore.getState().setView('playerCard')
}

beforeEach(() => {
    usePlayerCardStore.getState().resetPlayerCard()
    useViewStore.getState().setView('main')
})

describe('playerCardStore history', () => {
    test('opening a card from the main view starts with empty history', () => {
        openCard('A')
        expect(usePlayerCardStore.getState().history).toEqual([])
    })

    test('opening a card from inside a card remembers the previous one', () => {
        openCard('A')
        openCard('B')
        openCard('C')
        const { history, player } = usePlayerCardStore.getState()
        expect(player?.name).toBe('C')
        expect(history.map((h) => h.player?.name)).toEqual(['A', 'B'])
    })

    test('goBack restores the previous card step by step', () => {
        openCard('A')
        openCard('B')
        openCard('C')

        usePlayerCardStore.getState().goBack()
        expect(usePlayerCardStore.getState().player?.name).toBe('B')

        usePlayerCardStore.getState().goBack()
        expect(usePlayerCardStore.getState().player?.name).toBe('A')
        expect(usePlayerCardStore.getState().history).toEqual([])
    })

    test('goBack with empty history keeps the current card', () => {
        openCard('A')
        usePlayerCardStore.getState().goBack()
        expect(usePlayerCardStore.getState().player?.name).toBe('A')
    })

    test('goBack restores the other-game state of the previous card', () => {
        openCard('A', false)
        const store = usePlayerCardStore.getState()
        store.setOtherGameData({ name: 'A3' }, extraInfo('A'))
        store.setSelectedCoh3(true)
        openCard('B')

        usePlayerCardStore.getState().goBack()
        const state = usePlayerCardStore.getState()
        expect(state.player?.name).toBe('A3')
        expect(state.selectedCoh3).toBe(true)
        expect(state.initialCoh3).toBe(false)
        expect(state.otherPlayer?.name).toBe('A')
        expect(state.otherGameChecked).toBe(true)
    })

    test('closing the card clears the history', () => {
        openCard('A')
        openCard('B')
        openCard('C')
        usePlayerCardStore.getState().goBack()
        useViewStore.getState().setView('main')
        expect(usePlayerCardStore.getState().history).toEqual([])
        expect(usePlayerCardStore.getState().future).toEqual([])
    })

    test('opening a card from another view clears the history', () => {
        openCard('A')
        openCard('B')
        useViewStore.getState().setView('main')
        openCard('C')
        expect(usePlayerCardStore.getState().history).toEqual([])
    })

    test('history keeps at most 20 cards', () => {
        for (let i = 0; i < 25; i++) {
            openCard(`P${i}`)
        }
        const { history } = usePlayerCardStore.getState()
        expect(history).toHaveLength(20)
        expect(history[0].player?.name).toBe('P4')
        expect(history[19].player?.name).toBe('P23')
    })

    test('resetPlayerCard clears the history', () => {
        openCard('A')
        openCard('B')
        usePlayerCardStore.getState().resetPlayerCard()
        expect(usePlayerCardStore.getState().history).toEqual([])
    })
})

describe('playerCardStore forward', () => {
    const names = (cards: { player: { name?: string } | null }[]) =>
        cards.map((c) => c.player?.name)

    test('goForward returns to the cards left with goBack', () => {
        openCard('A')
        openCard('B')
        openCard('C')
        usePlayerCardStore.getState().goBack()
        usePlayerCardStore.getState().goBack()
        expect(names(usePlayerCardStore.getState().future)).toEqual(['C', 'B'])

        usePlayerCardStore.getState().goForward()
        expect(usePlayerCardStore.getState().player?.name).toBe('B')
        expect(names(usePlayerCardStore.getState().history)).toEqual(['A'])

        usePlayerCardStore.getState().goForward()
        const state = usePlayerCardStore.getState()
        expect(state.player?.name).toBe('C')
        expect(names(state.history)).toEqual(['A', 'B'])
        expect(state.future).toEqual([])
    })

    test('goForward with empty future keeps the current card', () => {
        openCard('A')
        openCard('B')
        usePlayerCardStore.getState().goForward()
        expect(usePlayerCardStore.getState().player?.name).toBe('B')
    })

    test('opening a new card from inside a card clears the future', () => {
        openCard('A')
        openCard('B')
        openCard('C')
        usePlayerCardStore.getState().goBack()
        openCard('D')
        const state = usePlayerCardStore.getState()
        expect(state.future).toEqual([])
        expect(names(state.history)).toEqual(['A', 'B'])
    })
})
