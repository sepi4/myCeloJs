import { useViewStore } from './viewStore'

beforeEach(() => {
    useViewStore.setState({ view: 'main', cardReturnView: 'main' })
})

describe('viewStore', () => {
    test('closing a card opened from the main view returns to the main view', () => {
        useViewStore.getState().setView('playerCard')
        useViewStore.getState().closeView()
        expect(useViewStore.getState().view).toBe('main')
    })

    test('closing a card opened from search returns to search', () => {
        useViewStore.getState().setView('search')
        useViewStore.getState().setView('playerCard')
        useViewStore.getState().closeView()
        expect(useViewStore.getState().view).toBe('search')
        useViewStore.getState().closeView()
        expect(useViewStore.getState().view).toBe('main')
    })

    test('setting the current view again changes nothing', () => {
        useViewStore.getState().setView('search')
        useViewStore.getState().setView('playerCard')
        useViewStore.getState().setView('playerCard')
        expect(useViewStore.getState().cardReturnView).toBe('search')
    })
})
