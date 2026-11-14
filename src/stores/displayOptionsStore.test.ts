import { useDisplayOptionsStore } from './displayOptionsStore'

beforeEach(() => {
    localStorage.clear()
    useDisplayOptionsStore.setState({
        displayOptions: { showAll: false, tableView: true, showTotal: true, showElo: true },
    })
})

async function loadStore() {
    vi.resetModules()
    return (await import('./displayOptionsStore')).useDisplayOptionsStore
}

describe('displayOptionsStore on load', () => {
    test('uses the defaults when nothing is saved', async () => {
        expect((await loadStore()).getState().displayOptions).toEqual({
            showAll: false,
            tableView: true,
            showTotal: true,
            showElo: true,
        })
    })

    test('saved values override the defaults', async () => {
        localStorage.setItem(
            'displayOptions',
            JSON.stringify({ showAll: true, tableView: false, showTotal: false, showElo: false })
        )
        expect((await loadStore()).getState().displayOptions).toEqual({
            showAll: true,
            tableView: false,
            showTotal: false,
            showElo: false,
        })
    })

    test('keeps the defaults for options that were not saved', async () => {
        localStorage.setItem('displayOptions', JSON.stringify({ tableView: false }))
        expect((await loadStore()).getState().displayOptions).toEqual({
            showAll: false,
            tableView: false,
            showTotal: true,
            showElo: true,
        })
    })
})

describe('displayOptionsStore — showElo toggle', () => {
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

describe('displayOptionsStore — saving', () => {
    test('saves only the option that was toggled', () => {
        useDisplayOptionsStore.getState().toggleDisplayOption('showAll')
        expect(JSON.parse(localStorage.getItem('displayOptions')!)).toEqual({ showAll: true })
    })

    test('keeps earlier saved options when another one is toggled', () => {
        const { toggleDisplayOption } = useDisplayOptionsStore.getState()
        toggleDisplayOption('showAll')
        toggleDisplayOption('showElo')
        expect(JSON.parse(localStorage.getItem('displayOptions')!)).toEqual({
            showAll: true,
            showElo: false,
        })
    })
})
