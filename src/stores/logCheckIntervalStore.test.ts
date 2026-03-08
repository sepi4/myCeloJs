/**
 * @jest-environment jsdom
 */
import { useLogCheckIntervalStore } from './logCheckIntervalStore'

beforeEach(() => {
    localStorage.clear()
    useLogCheckIntervalStore.setState({ logCheckInterval: 3 })
})

describe('logCheckIntervalStore', () => {
    test('defaults to 3', () => {
        expect(useLogCheckIntervalStore.getState().logCheckInterval).toBe(3)
    })

    test('setLogCheckInterval updates the value', () => {
        useLogCheckIntervalStore.getState().setLogCheckInterval(10)
        expect(useLogCheckIntervalStore.getState().logCheckInterval).toBe(10)
    })

    test('setLogCheckInterval persists to localStorage', () => {
        useLogCheckIntervalStore.getState().setLogCheckInterval(5)
        expect(JSON.parse(localStorage.getItem('logCheckInterval')!)).toBe(5)
    })
})
