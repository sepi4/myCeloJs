import { isInPeriod, useHistoryPeriodStore } from './historyPeriodStore'

beforeEach(() => {
    localStorage.clear()
    useHistoryPeriodStore.setState({ historyPeriod: 'all' })
})

async function loadStore() {
    vi.resetModules()
    return (await import('./historyPeriodStore')).useHistoryPeriodStore
}

describe('historyPeriodStore on load', () => {
    test('defaults to all when nothing is saved', async () => {
        expect((await loadStore()).getState().historyPeriod).toBe('all')
    })

    test('uses the saved value', async () => {
        localStorage.setItem('historyPeriod', '"week"')
        expect((await loadStore()).getState().historyPeriod).toBe('week')
    })

    test('falls back to all when the saved value is unknown', async () => {
        localStorage.setItem('historyPeriod', '"decade"')
        expect((await loadStore()).getState().historyPeriod).toBe('all')
    })
})

describe('historyPeriodStore', () => {
    test('setHistoryPeriod updates the value', () => {
        useHistoryPeriodStore.getState().setHistoryPeriod('month')
        expect(useHistoryPeriodStore.getState().historyPeriod).toBe('month')
    })

    test('setHistoryPeriod persists to localStorage', () => {
        useHistoryPeriodStore.getState().setHistoryPeriod('week')
        expect(JSON.parse(localStorage.getItem('historyPeriod')!)).toBe('week')
    })
})

describe('isInPeriod', () => {
    const now = new Date(2026, 9, 22, 12, 0)

    test('all includes any date', () => {
        expect(isInPeriod(new Date(2000, 0, 1), 'all', now)).toBe(true)
    })

    test('week includes the last 7 days only', () => {
        expect(isInPeriod(new Date(2026, 9, 16, 12, 0), 'week', now)).toBe(true)
        expect(isInPeriod(new Date(2026, 9, 14, 12, 0), 'week', now)).toBe(false)
    })

    test('month includes the last month only', () => {
        expect(isInPeriod(new Date(2026, 8, 25), 'month', now)).toBe(true)
        expect(isInPeriod(new Date(2026, 8, 20), 'month', now)).toBe(false)
    })

    test('year includes the last year only', () => {
        expect(isInPeriod(new Date(2025, 11, 1), 'year', now)).toBe(true)
        expect(isInPeriod(new Date(2025, 9, 1), 'year', now)).toBe(false)
    })
})
