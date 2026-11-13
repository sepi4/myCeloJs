import getText from './getText'

describe('Get translation text', () => {
    test('getText()', () => {
        expect(getText('game')).toBe('game')
        expect(getText('game', 'ru')).toBe('игра')
        expect(getText('game', 'en')).toBe('game')
    })
})
