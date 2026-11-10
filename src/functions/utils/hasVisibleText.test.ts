import hasVisibleText from './hasVisibleText'

describe('hasVisibleText', () => {
    test('accepts normal names', () => {
        expect(hasVisibleText('bcd')).toBe(true)
        expect(hasVisibleText('我知道喵')).toBe(true)
        expect(hasVisibleText(' \u200Bx\u3164')).toBe(true)
    })

    test('rejects names made only of invisible characters', () => {
        expect(hasVisibleText('')).toBe(false)
        expect(hasVisibleText(undefined)).toBe(false)
        expect(hasVisibleText('   ')).toBe(false)
        expect(hasVisibleText('\u00A0\u3000')).toBe(false)
        expect(hasVisibleText('\u200B\u200C\u200D\u2060\uFEFF')).toBe(false)
        expect(hasVisibleText('\u3164\u115F\u1160\uFFA0')).toBe(false)
        expect(hasVisibleText('\u2800\u2800')).toBe(false)
    })
})
