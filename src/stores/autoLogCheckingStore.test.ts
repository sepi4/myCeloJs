/**
 * @jest-environment jsdom
 */
import { useAutoLogCheckingStore } from './autoLogCheckingStore'

beforeEach(() => {
    localStorage.clear()
    useAutoLogCheckingStore.setState({ autoLogChecking: true })
})

describe('autoLogCheckingStore', () => {
    test('defaults to true', () => {
        expect(useAutoLogCheckingStore.getState().autoLogChecking).toBe(true)
    })

    test('toggleAutoLogChecking flips the value', () => {
        useAutoLogCheckingStore.getState().toggleAutoLogChecking()
        expect(useAutoLogCheckingStore.getState().autoLogChecking).toBe(false)

        useAutoLogCheckingStore.getState().toggleAutoLogChecking()
        expect(useAutoLogCheckingStore.getState().autoLogChecking).toBe(true)
    })

    test('toggleAutoLogChecking persists to localStorage', () => {
        useAutoLogCheckingStore.getState().toggleAutoLogChecking()
        expect(JSON.parse(localStorage.getItem('autoLogChecking')!)).toBe(false)
    })
})
