/**
 * @jest-environment jsdom
 */
import { useAlertStore } from './alertStore'

beforeEach(() => {
    localStorage.clear()
    useAlertStore.setState({ alert: false })
})

describe('alertStore', () => {
    test('defaults to false', () => {
        expect(useAlertStore.getState().alert).toBe(false)
    })

    test('toggleAlert flips the value', () => {
        useAlertStore.getState().toggleAlert()
        expect(useAlertStore.getState().alert).toBe(true)

        useAlertStore.getState().toggleAlert()
        expect(useAlertStore.getState().alert).toBe(false)
    })

    test('toggleAlert persists to localStorage', () => {
        useAlertStore.getState().toggleAlert()
        expect(JSON.parse(localStorage.getItem('alert')!)).toBe(true)
    })
})
