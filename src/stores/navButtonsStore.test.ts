/**
 * @jest-environment jsdom
 */
import { useNavButtonsStore } from './navButtonsStore'

beforeEach(() => {
    localStorage.clear()
    useNavButtonsStore.setState({
        navButtons: { all: false, table: false, total: false, coh3: false, elo: false },
    })
})

describe('navButtonsStore — elo toggle', () => {
    test('elo defaults to false', () => {
        const { navButtons } = useNavButtonsStore.getState()
        expect(navButtons.elo).toBe(false)
    })

    test('toggleNavButton flips elo to true', () => {
        useNavButtonsStore.getState().toggleNavButton('elo')
        expect(useNavButtonsStore.getState().navButtons.elo).toBe(true)
    })

    test('toggling elo persists to localStorage', () => {
        useNavButtonsStore.getState().toggleNavButton('elo')
        const stored = JSON.parse(localStorage.getItem('navButtons')!)
        expect(stored.elo).toBe(true)
    })

    test('toggling elo twice returns to false', () => {
        const { toggleNavButton } = useNavButtonsStore.getState()
        toggleNavButton('elo')
        toggleNavButton('elo')
        expect(useNavButtonsStore.getState().navButtons.elo).toBe(false)
    })
})
