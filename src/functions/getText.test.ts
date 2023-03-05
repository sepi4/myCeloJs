import getText from "./getText"

describe('Get translation text', () => {
    test('getText()', () => {
        expect(getText('game', null)).toBe('game');

        let fakeSettings = { language: 'ru' }
        expect(getText('game', fakeSettings)).toBe('игра');

        fakeSettings.language = 'en'
        expect(getText('game', fakeSettings)).toBe('game');
    });
});