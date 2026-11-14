import { useDisplayOptionsStore } from './displayOptionsStore'

beforeEach(() => {
    localStorage.clear()
    useDisplayOptionsStore.setState({
        displayOptions: { showAll: false, tableView: true, showTotal: true, showElo: true },
    })
})

describe('displayOptionsStore — showElo toggle', () => {
    test('showElo defaults to true', () => {
        const { displayOptions } = useDisplayOptionsStore.getState()
        expect(displayOptions.showElo).toBe(true)
    })

    test('toggleDisplayOption flips showElo to false', () => {
        useDisplayOptionsStore.getState().toggleDisplayOption('showElo')
        expect(useDisplayOptionsStore.getState().displayOptions.showElo).toBe(false)
    })

    test('toggling showElo persists to localStorage', () => {
        useDisplayOptionsStore.getState().toggleDisplayOption('showElo')
        const stored = JSON.parse(localStorage.getItem('displayOptions')!)
        expect(stored.showElo).toBe(false)
    })

    test('toggling showElo twice returns to true', () => {
        const { toggleDisplayOption } = useDisplayOptionsStore.getState()
        toggleDisplayOption('showElo')
        toggleDisplayOption('showElo')
        expect(useDisplayOptionsStore.getState().displayOptions.showElo).toBe(true)
    })
})
