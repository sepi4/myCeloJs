import { personalStatSearchUrl } from './apiUrls'

describe('personalStatSearchUrl', () => {
    it('encodes special characters in the search value', () => {
        const url = new URL(personalStatSearchUrl('coh3', 'Tom & Jerry'))
        expect(url.searchParams.get('search')).toBe('Tom & Jerry')
        expect(url.searchParams.has(' Jerry')).toBe(false)
    })
})
