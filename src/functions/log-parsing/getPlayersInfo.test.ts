import { getPlayersInfo } from './getPlayersInfo'

describe('getPlayersInfo', () => {
    it('parses a single player line', () => {
        const lines = ['21:01:16.90   GAME -- Human Player: 2 sepi 580525 0 soviet']
        const result = getPlayersInfo(lines)

        expect(result).toHaveLength(1)
        expect(result[0]).toEqual({
            faction: 'soviet',
            name: 'sepi',
            profileId: 580525,
            teamSlot: 0,
            time: '21:01:16.90',
            ranking: -1,
        })
    })

    it('parses multiple players from different teams', () => {
        const lines = [
            '21:01:16.90   GAME -- Human Player: 1 alice 11111 0 soviet',
            '21:01:16.90   GAME -- Human Player: 2 bob 22222 1 german',
        ]
        const result = getPlayersInfo(lines)

        expect(result).toHaveLength(2)
        expect(result[0].name).toBe('alice')
        expect(result[0].teamSlot).toBe(0)
        expect(result[1].name).toBe('bob')
        expect(result[1].teamSlot).toBe(1)
    })

    it('handles player names with spaces', () => {
        const lines = ['21:01:16.90   GAME -- Human Player: 1 player with spaces 99999 0 soviet']
        const result = getPlayersInfo(lines)

        expect(result[0].name).toBe('player with spaces')
        expect(result[0].profileId).toBe(99999)
    })

    it('extracts time from the first player line', () => {
        const lines = [
            '14:30:45.12   GAME -- Human Player: 1 first 11111 0 soviet',
            '14:30:45.12   GAME -- Human Player: 2 second 22222 1 german',
        ]
        const result = getPlayersInfo(lines)

        expect(result[0].time).toBe('14:30:45.12')
        expect(result[1].time).toBe('14:30:45.12')
    })

    it('later slots overwrite earlier ones with the same slot number', () => {
        const lines = [
            '21:01:16.90   GAME -- Human Player: 1 first 11111 0 soviet',
            '21:01:16.90   GAME -- Human Player: 1 replaced 22222 1 german',
        ]
        const result = getPlayersInfo(lines)

        expect(result).toHaveLength(1)
        expect(result[0].name).toBe('replaced')
    })

    it('sets ranking to -1 for all players', () => {
        const lines = [
            '21:01:16.90   GAME -- Human Player: 1 alice 11111 0 soviet',
            '21:01:16.90   GAME -- Human Player: 2 bob 22222 1 german',
        ]
        const result = getPlayersInfo(lines)

        expect(result.every((p) => p.ranking === -1)).toBe(true)
    })

    it('returns empty array when no valid lines', () => {
        const result = getPlayersInfo([])
        expect(result).toEqual([])
    })
})
