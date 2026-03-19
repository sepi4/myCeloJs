import { RankingsJson } from '../types'
import { renderRankingsBody, renderRankingsPage, renderRankingsTxtBody } from './renderRankingsHtml'

const team = (overrides: Partial<RankingsJson['teams']['team1'][0]> = {}) => ({
    name: 'TestPlayer',
    ranking: '1200',
    country: 'fi',
    faction: 'usa',
    ...overrides,
})

const rankings = (overrides: Partial<RankingsJson> = {}): RankingsJson => ({
    teams: { team1: [team()], team2: [team({ name: 'Enemy', faction: 'wer' })] },
    horizontal: false,
    ...overrides,
})

describe('renderRankingsBody', () => {
    it('contains player names', () => {
        const html = renderRankingsBody(rankings())

        expect(html).toContain('TestPlayer')
        expect(html).toContain('Enemy')
    })

    it('contains faction image paths', () => {
        const html = renderRankingsBody(rankings())

        expect(html).toContain('/img/usa.png')
        expect(html).toContain('/img/wer.png')
    })

    it('contains country flag image paths', () => {
        const html = renderRankingsBody(rankings())

        expect(html).toContain('/img/countryFlags/fi.png')
    })

    it('omits country image when country is empty', () => {
        const html = renderRankingsBody(
            rankings({ teams: { team1: [team({ country: undefined })], team2: [] } })
        )

        expect(html).not.toContain('/img/countryFlags/')
    })

    it('contains ranking values', () => {
        const html = renderRankingsBody(rankings())

        expect(html).toContain('1200')
    })

    it('uses vertical classes when horizontal is false', () => {
        const html = renderRankingsBody(rankings({ horizontal: false }))

        expect(html).toContain('bodyStyle')
        expect(html).toContain('teamStyle')
        expect(html).not.toContain('bodyStyleHorizontal')
        expect(html).not.toContain('teamStyleHorizontal')
    })

    it('uses horizontal classes when horizontal is true', () => {
        const html = renderRankingsBody(rankings({ horizontal: true }))

        expect(html).toContain('bodyStyleHorizontal')
        expect(html).toContain('teamStyleHorizontal')
    })

    it('reverses element order for team1 in horizontal mode', () => {
        const html = renderRankingsBody(rankings({ horizontal: true }))

        // Team1 players should have reversed class
        expect(html).toContain('playerStyle reversed')
    })

    it('does not reverse team2 players', () => {
        const data = rankings({
            horizontal: true,
            teams: { team1: [], team2: [team({ name: 'OnlyTeam2' })] },
        })
        const html = renderRankingsBody(data)

        // No reversed class when only team2
        expect(html).not.toContain('reversed')
    })

    it('escapes HTML in player names', () => {
        const data = rankings({
            teams: { team1: [team({ name: '<script>alert(1)</script>' })], team2: [] },
        })
        const html = renderRankingsBody(data)

        expect(html).not.toContain('<script>alert(1)</script>')
        expect(html).toContain('&lt;script&gt;')
    })

    it('renders multiple players per team', () => {
        const data = rankings({
            teams: {
                team1: [team({ name: 'A' }), team({ name: 'B' })],
                team2: [team({ name: 'C' }), team({ name: 'D' })],
            },
        })
        const html = renderRankingsBody(data)

        expect(html).toContain('A')
        expect(html).toContain('B')
        expect(html).toContain('C')
        expect(html).toContain('D')
    })
})

describe('renderRankingsTxtBody', () => {
    it('wraps text in a pre tag', () => {
        const html = renderRankingsTxtBody('hello')

        expect(html).toMatch(/^<pre[^>]*>.*<\/pre>$/)
    })

    it('preserves line breaks as <br> tags', () => {
        const html = renderRankingsTxtBody('line1\nline2\nline3')

        expect(html).toContain('line1<br>line2<br>line3')
    })

    it('escapes HTML in text content', () => {
        const html = renderRankingsTxtBody('<b>bold</b>')

        expect(html).not.toContain('<b>')
        expect(html).toContain('&lt;b&gt;')
    })
})

describe('renderRankingsPage', () => {
    it('returns a complete HTML document', () => {
        const html = renderRankingsPage()

        expect(html).toContain('<!doctype html>')
        expect(html).toContain('<html')
        expect(html).toContain('</html>')
    })

    it('includes SSE EventSource script', () => {
        const html = renderRankingsPage()

        expect(html).toContain('EventSource')
        expect(html).toContain('/events')
    })

    it('includes CSS styles', () => {
        const html = renderRankingsPage()

        expect(html).toContain('<style>')
        expect(html).toContain('.playerStyle')
        expect(html).toContain('.factionStyle')
    })
})
