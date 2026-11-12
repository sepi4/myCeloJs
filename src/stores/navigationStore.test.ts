import { ExtraInfo } from '../types'
import { useNavigationStore } from './navigationStore'
import { usePlayerCardStore } from './playerCardStore'
import { useViewStore } from './viewStore'

const extraInfo = (steamId: string) => ({ steamId, ranks: [] }) as unknown as ExtraInfo
const nav = () => useNavigationStore.getState()
const view = () => useViewStore.getState().view
const cardName = () => usePlayerCardStore.getState().player?.name

function openCard(name: string, profileId?: number) {
    nav().openPlayerCard({ name, profileId }, extraInfo(name), 'coh2')
}

beforeEach(() => {
    nav().resetNavigation()
})

describe('navigationStore', () => {
    test('back from the first card returns to the main view, forward to the card', () => {
        openCard('A')
        nav().goBack()
        expect(view()).toBe('main')

        nav().goForward()
        expect(view()).toBe('playerCard')
        expect(cardName()).toBe('A')
    })

    test('back and forward move through cards step by step', () => {
        openCard('A')
        openCard('B')
        openCard('C')

        nav().goBack()
        expect(cardName()).toBe('B')
        nav().goBack()
        expect(cardName()).toBe('A')
        nav().goForward()
        expect(cardName()).toBe('B')
        nav().goForward()
        expect(cardName()).toBe('C')
        expect(nav().forward).toEqual([])
    })

    test('back and forward do nothing at the ends of the history', () => {
        nav().goBack()
        expect(view()).toBe('main')
        openCard('A')
        nav().goForward()
        expect(cardName()).toBe('A')
    })

    test('closing a card returns to the main view and back reopens the card', () => {
        openCard('A')
        usePlayerCardStore.getState().updateGameHistory({ open: true, openGame: 3 })
        nav().closeView()
        expect(view()).toBe('main')

        nav().goBack()
        expect(view()).toBe('playerCard')
        expect(cardName()).toBe('A')
        expect(usePlayerCardStore.getState().gameHistory).toMatchObject({
            open: true,
            openGame: 3,
        })
    })

    test('a card opened from search closes back to search', () => {
        nav().openView('search')
        openCard('A')
        nav().closeView()
        expect(view()).toBe('search')
        nav().closeView()
        expect(view()).toBe('main')
    })

    test('back returns to search with the card that was opened from it', () => {
        nav().openView('search')
        openCard('A')
        nav().closeView()
        openCard('B')

        nav().goBack()
        expect(view()).toBe('search')
        nav().goBack()
        expect(cardName()).toBe('A')
        expect(useViewStore.getState().cardReturnView).toBe('search')
        nav().goBack()
        expect(view()).toBe('search')
        nav().goBack()
        expect(view()).toBe('main')
    })

    test('opening the card that is already shown changes nothing', () => {
        openCard('A', 1)
        openCard('B', 2)
        usePlayerCardStore.getState().updateGameHistory({ open: true })

        openCard('B', 2)
        expect(nav().back).toHaveLength(2)
        expect(usePlayerCardStore.getState().gameHistory.open).toBe(true)
    })

    test('opening the current view again changes nothing', () => {
        nav().openView('search')
        nav().openView('search')
        expect(nav().back).toHaveLength(1)
    })

    test('going somewhere new clears the forward history', () => {
        openCard('A')
        openCard('B')
        nav().goBack()
        openCard('C')
        expect(nav().forward).toEqual([])
        nav().goBack()
        expect(cardName()).toBe('A')
    })

    test('the history keeps at most 50 places', () => {
        for (let i = 0; i < 60; i++) {
            openCard(`P${i}`)
        }
        const { back } = nav()
        expect(back).toHaveLength(50)
        expect(back[0]?.card?.player?.name).toBe('P9')
        expect(back[49]?.card?.player?.name).toBe('P58')
    })

    test('resetNavigation shows the main view and forgets the history', () => {
        openCard('A')
        openCard('B')
        nav().goBack()
        nav().resetNavigation()
        expect(view()).toBe('main')
        expect(cardName()).toBeUndefined()
        expect(nav().back).toEqual([])
        expect(nav().forward).toEqual([])
    })

    test('back restores the other-game state of the previous card', () => {
        openCard('A')
        const store = usePlayerCardStore.getState()
        store.setOtherGameData({ name: 'A3' }, extraInfo('A'))
        store.setSelectedGame('coh3')
        openCard('B')

        nav().goBack()
        const state = usePlayerCardStore.getState()
        expect(state.player?.name).toBe('A3')
        expect(state.selectedGame).toBe('coh3')
        expect(state.initialGame).toBe('coh2')
        expect(state.otherPlayer?.name).toBe('A')
        expect(state.otherGameChecked).toBe(true)
    })

    test('the card counter grows each time a card is shown', () => {
        openCard('A')
        const start = usePlayerCardStore.getState().navigation
        openCard('B')
        nav().goBack()
        nav().goBack()
        nav().goForward()
        expect(usePlayerCardStore.getState().navigation).toBe(start + 3)
    })
})
