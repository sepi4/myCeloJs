import { Game } from '../constants/games'
import { ExtraInfo } from '../types'
import { snapshotPlayerCard, usePlayerCardStore } from './playerCardStore'

const extraInfo = (steamId: string) => ({ steamId, ranks: [] }) as unknown as ExtraInfo

function openCard(name: string, game: Game = 'coh2') {
    usePlayerCardStore.getState().setPlayerCard({ name }, extraInfo(name), game)
}

beforeEach(() => {
    usePlayerCardStore.getState().resetPlayerCard()
})

describe('playerCardStore', () => {
    test('restorePlayerCard shows a saved card again', () => {
        const data = { matchHistoryStats: [], profiles: {} }
        openCard('A')
        usePlayerCardStore.getState().updateGameHistory({ open: true, data, openGame: 1 })
        const saved = snapshotPlayerCard()
        openCard('B')

        usePlayerCardStore.getState().restorePlayerCard(saved)
        const state = usePlayerCardStore.getState()
        expect(state.player?.name).toBe('A')
        expect(state.gameHistory).toEqual({ data, open: true, openGame: 1 })
    })
})

describe('playerCardStore game history', () => {
    const data = { matchHistoryStats: [], profiles: {} }

    test('a new card starts with a closed, empty game history', () => {
        openCard('A')
        usePlayerCardStore.getState().updateGameHistory({ open: true, data })
        openCard('B')
        expect(usePlayerCardStore.getState().gameHistory).toEqual({
            data: null,
            open: false,
            openGame: null,
        })
    })

    test('updateGameHistory merges the change into the current state', () => {
        openCard('A')
        usePlayerCardStore.getState().updateGameHistory({ open: true })
        usePlayerCardStore.getState().updateGameHistory({ data, openGame: 7 })
        expect(usePlayerCardStore.getState().gameHistory).toEqual({ data, open: true, openGame: 7 })
    })

    test('switching between coh2 and coh3 resets the game history', () => {
        openCard('A')
        const store = usePlayerCardStore.getState()
        store.setOtherGameData({ name: 'A3' }, extraInfo('A'))
        store.updateGameHistory({ open: true, data })
        store.setSelectedGame('coh3')
        expect(usePlayerCardStore.getState().gameHistory.open).toBe(false)
        expect(usePlayerCardStore.getState().gameHistory.data).toBeNull()
    })
})
