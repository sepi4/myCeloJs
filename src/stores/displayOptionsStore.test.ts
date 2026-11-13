import { useDisplayOptionsStore } from './displayOptionsStore'

beforeEach(() => {
    localStorage.clear()
    useDisplayOptionsStore.setState({
        displayOptions: { showAll: false, tableView: false, showTotal: false, showElo: false },
    })
})

describe('displayOptionsStore — showElo toggle', () => {
    test('showElo defaults to false', () => {
        const { displayOptions } = useDisplayOptionsStore.getState()
        expect(displayOptions.showElo).toBe(false)
    })

    test('toggleDisplayOption flips showElo to true', () => {
        useDisplayOptionsStore.getState().toggleDisplayOption('showElo')
        expect(useDisplayOptionsStore.getState().displayOptions.showElo).toBe(true)
    })

    test('toggling showElo persists to localStorage', () => {
        useDisplayOptionsStore.getState().toggleDisplayOption('showElo')
        const stored = JSON.parse(localStorage.getItem('displayOptions')!)
        expect(stored.showElo).toBe(true)
    })

    test('toggling showElo twice returns to false', () => {
        const { toggleDisplayOption } = useDisplayOptionsStore.getState()
        toggleDisplayOption('showElo')
        toggleDisplayOption('showElo')
        expect(useDisplayOptionsStore.getState().displayOptions.showElo).toBe(false)
    })
})
