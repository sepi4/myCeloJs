import { useViewStore } from './viewStore'

beforeEach(() => {
    useViewStore.setState({ view: 'main', cardReturnView: 'main' })
})

describe('viewStore', () => {
    test('a card opened from search remembers search as its return view', () => {
        useViewStore.getState().setView('search')
        useViewStore.getState().setView('playerCard')
        expect(useViewStore.getState().cardReturnView).toBe('search')
    })

    test('setting the current view again changes nothing', () => {
        useViewStore.getState().setView('search')
        useViewStore.getState().setView('playerCard')
        useViewStore.getState().setView('playerCard')
        expect(useViewStore.getState().cardReturnView).toBe('search')
    })

    test('a given return view replaces the remembered one', () => {
        useViewStore.getState().setView('search')
        useViewStore.getState().setView('playerCard')
        useViewStore.getState().setView('playerCard', 'main')
        expect(useViewStore.getState().cardReturnView).toBe('main')
    })
})
