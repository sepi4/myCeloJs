import { getTimeRange } from './time'

describe('getTimeRange', () => {
    it('shows the date once when the game ends on the same day', () => {
        const start = new Date(2026, 4, 6, 0, 42, 26)
        const end = new Date(2026, 4, 6, 1, 6, 18)
        expect(getTimeRange(start, end, 'en')).toBe('May 6, 2026 12:42 AM–1:06 AM')
    })

    it('shows both dates when the game ends on another day', () => {
        const start = new Date(2026, 4, 6, 23, 50)
        const end = new Date(2026, 4, 7, 0, 20)
        expect(getTimeRange(start, end, 'en')).toBe('May 6, 2026 11:50 PM – May 7, 2026 12:20 AM')
    })
})
