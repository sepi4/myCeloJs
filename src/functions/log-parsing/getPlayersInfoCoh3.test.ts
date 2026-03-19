import { getPlayersInfoCoh3 } from './getPlayersInfoCoh3'

describe('getPlayersInfoCoh3', () => {
    it('parses a single player line', () => {
        const lines = [
            '(I) [20:19:11.164] [000021616]: GAME -- Human Player: 0 sepi 21518 0 germans',
        ]
        const result = getPlayersInfoCoh3(lines)

        expect(result).toHaveLength(1)
        expect(result[0]).toEqual({
            faction: 'germans',
            name: 'sepi',
            profileId: 21518,
            teamSlot: 0,
            time: '(I) [20:19:11.164] [000021616]',
            ranking: undefined,
        })
    })

    it('parses multiple players from different teams', () => {
        const lines = [
            '(I) [20:19:11.164] [000021616]: GAME -- Human Player: 0 alice 11111 0 germans',
            '(I) [20:19:11.164] [000021616]: GAME -- Human Player: 1 bob 22222 1 british_africa',
        ]
        const result = getPlayersInfoCoh3(lines)

        expect(result).toHaveLength(2)
        expect(result[0].name).toBe('alice')
        expect(result[0].teamSlot).toBe(0)
        expect(result[1].name).toBe('bob')
        expect(result[1].teamSlot).toBe(1)
    })

    it('handles player names with spaces', () => {
        const lines = [
            '(I) [20:19:11.164] [000021616]: GAME -- Human Player: 0 player with spaces 99999 0 americans',
        ]
        const result = getPlayersInfoCoh3(lines)

        expect(result[0].name).toBe('player with spaces')
        expect(result[0].profileId).toBe(99999)
    })

    it('extracts time from the first player line', () => {
        const lines = [
            '(I) [14:30:45.120] [000012345]: GAME -- Human Player: 0 first 11111 0 americans',
            '(I) [14:30:45.120] [000012345]: GAME -- Human Player: 1 second 22222 1 germans',
        ]
        const result = getPlayersInfoCoh3(lines)

        expect(result[0].time).toBe('(I) [14:30:45.120] [000012345]')
        expect(result[1].time).toBe('(I) [14:30:45.120] [000012345]')
    })

    it('attaches ranking from Match Started lines', () => {
        const lines = [
            '(I) [20:19:11.164] [000021616]: GAME -- Human Player: 0 alice 11111 0 americans',
            'Match Started - [11111 /steam/76561], slot =  0, ranking =  1500',
        ]
        const result = getPlayersInfoCoh3(lines)

        expect(result[0].ranking).toBe(1500)
    })

    it('handles negative ranking values', () => {
        const lines = [
            '(I) [20:19:11.164] [000021616]: GAME -- Human Player: 0 alice 11111 0 americans',
            'Match Started - [11111 /steam/76561], slot =  0, ranking =  -1',
        ]
        const result = getPlayersInfoCoh3(lines)

        expect(result[0].ranking).toBe(-1)
    })

    it('matches ranking to correct player by profileId', () => {
        const lines = [
            '(I) [20:19:11.164] [000021616]: GAME -- Human Player: 0 alice 11111 0 americans',
            '(I) [20:19:11.164] [000021616]: GAME -- Human Player: 1 bob 22222 1 germans',
            'Match Started - [11111 /steam/76561], slot =  0, ranking =  1200',
            'Match Started - [22222 /steam/76562], slot =  1, ranking =  1800',
        ]
        const result = getPlayersInfoCoh3(lines)

        expect(result[0].ranking).toBe(1200)
        expect(result[1].ranking).toBe(1800)
    })

    it('returns empty array when no valid lines', () => {
        const result = getPlayersInfoCoh3([])
        expect(result).toEqual([])
    })
})
