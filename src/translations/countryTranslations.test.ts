import { describe, expect, test } from 'vitest'

import { countryAlpha3, countryNamesRu, getCountryName } from './countryTranslations'

const codes = Object.keys(countryAlpha3)

describe('country lists', () => {
    test('every country has a Russian name', () => {
        expect(codes.filter((code) => !countryNamesRu[code])).toEqual([])
    })

    test('every Russian name belongs to a known country', () => {
        expect(Object.keys(countryNamesRu).filter((code) => !countryAlpha3[code])).toEqual([])
    })

    test('every country has an English name', () => {
        expect(codes.filter((code) => !getCountryName(code, 'en'))).toEqual([])
    })
})

describe('getCountryName', () => {
    test('uses the common English name', () => {
        expect(getCountryName('kr', 'en')).toBe('South Korea')
        expect(getCountryName('ru', 'en')).toBe('Russia')
    })

    test('uses the Russian list for Russian', () => {
        expect(getCountryName('kr', 'ru')).toBe('Южная Корея')
    })

    test('returns an empty string for a missing or unknown code', () => {
        expect(getCountryName(undefined, 'en')).toBe('')
        expect(getCountryName('zz', 'en')).toBe('')
        expect(getCountryName('not a code', 'ru')).toBe('')
    })
})
