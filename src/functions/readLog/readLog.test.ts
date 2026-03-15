import { Player } from '../../types'
import {
    checkGameVersionIsCorrect,
    getCurrentUserAlias,
    getCurrentUserAliasCoh3,
    getLines,
    switchTeams,
} from './readLog'

const makePlayer = (name: string, teamSlot: number, profileId?: number): Player =>
    ({
        name,
        teamSlot,
        profileId,
        faction: 'soviet',
        time: '',
    }) as Player

describe('getCurrentUserAlias', () => {
    it('extracts username from COH2 log line', () => {
        const lines = ['some other line', 'GAME -- Current user name is [sepi4]', 'another line']
        expect(getCurrentUserAlias(lines)).toBe('sepi4')
    })

    it('returns undefined when no match found', () => {
        const lines = ['some line', 'another line']
        expect(getCurrentUserAlias(lines)).toBeUndefined()
    })

    it('returns first match when multiple exist', () => {
        const lines = [
            'GAME -- Current user name is [first]',
            'GAME -- Current user name is [second]',
        ]
        expect(getCurrentUserAlias(lines)).toBe('first')
    })
})

describe('getCurrentUserAliasCoh3', () => {
    it('extracts username from COH3 log line', () => {
        const lines = ['some other line', 'GAME -- Current Steam name is [playerName]']
        expect(getCurrentUserAliasCoh3(lines)).toBe('playerName')
    })

    it('returns undefined when no match found', () => {
        const lines = ['some line']
        expect(getCurrentUserAliasCoh3(lines)).toBeUndefined()
    })
})

describe('checkGameVersionIsCorrect', () => {
    it('matches COH2 log when coh3 is false', () => {
        const lines = ['RELICCOH2 some log header']
        expect(checkGameVersionIsCorrect(lines, false)).toBeTruthy()
    })

    it('matches COH3 log when coh3 is true', () => {
        const lines = ['RelicCoH3 some log header']
        expect(checkGameVersionIsCorrect(lines, true)).toBeTruthy()
    })

    it('returns falsy for wrong game version', () => {
        const lines = ['RELICCOH2 some log header']
        expect(checkGameVersionIsCorrect(lines, true)).toBeFalsy()
    })
})

describe('getLines', () => {
    it('extracts player lines from the last game', () => {
        const lines = [
            'some line',
            'GAME -- Human Player: 1 alice 12345 0 soviet',
            'GAME -- Human Player: 2 bob 67890 1 german',
            'other stuff',
        ]
        const result = getLines(lines)
        expect(result).toHaveLength(2)
        expect(result[0]).toContain('bob')
        expect(result[1]).toContain('alice')
    })

    it('stops at the previous game boundary', () => {
        const lines = [
            'GAME -- Human Player: 1 old 11111 0 soviet',
            'some gap line',
            'GAME -- Human Player: 1 new1 22222 0 soviet',
            'GAME -- Human Player: 2 new2 33333 1 german',
        ]
        const result = getLines(lines)
        expect(result).toHaveLength(2)
        expect(result[0]).toContain('new2')
        expect(result[1]).toContain('new1')
    })

    it('includes Match Started lines for COH3', () => {
        const lines = [
            'GAME -- Human Player: 1 alice 12345 0 americans',
            'Match Started steam:123 slot:0 ranking:1000',
        ]
        const result = getLines(lines)
        expect(result).toHaveLength(2)
    })

    it('returns empty array when no player lines', () => {
        const lines = ['some line', 'another line']
        expect(getLines(lines)).toEqual([])
    })
})

describe('switchTeams', () => {
    it('swaps teams when current user is on team 1', () => {
        const players = [makePlayer('enemy', 0, 111), makePlayer('me', 1, 222)]
        const result = switchTeams(players, 'me')
        expect(result.find((p) => p.name === 'me')?.teamSlot).toBe(0)
        expect(result.find((p) => p.name === 'enemy')?.teamSlot).toBe(1)
    })

    it('does not swap when current user is already on team 0', () => {
        const players = [makePlayer('me', 0, 111), makePlayer('enemy', 1, 222)]
        const result = switchTeams(players, 'me')
        expect(result.find((p) => p.name === 'me')?.teamSlot).toBe(0)
        expect(result.find((p) => p.name === 'enemy')?.teamSlot).toBe(1)
    })

    it('does not swap when current user is not found', () => {
        const players = [makePlayer('alice', 0, 111), makePlayer('bob', 1, 222)]
        const result = switchTeams(players, 'unknown')
        expect(result[0].teamSlot).toBe(0)
        expect(result[1].teamSlot).toBe(1)
    })

    it('does not swap when current user has no profileId', () => {
        const players = [makePlayer('me', 1), makePlayer('enemy', 0, 111)]
        const result = switchTeams(players, 'me')
        expect(result.find((p) => p.name === 'me')?.teamSlot).toBe(1)
    })
})
