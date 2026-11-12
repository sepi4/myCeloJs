import getLocalStorage, { setLocalStorage } from './getLocalStorage'

beforeEach(() => {
    localStorage.clear()
})

describe('getLocalStorage', () => {
    test('returns the default when nothing is saved', () => {
        expect(getLocalStorage('alert', false)).toBe(false)
    })

    test('returns the value saved with setLocalStorage', () => {
        setLocalStorage('alert', true)
        expect(getLocalStorage('alert', false)).toBe(true)
    })

    test('returns the default when the saved value is not JSON', () => {
        localStorage.setItem('alert', 'not json')
        expect(getLocalStorage('alert', false)).toBe(false)
    })
})
