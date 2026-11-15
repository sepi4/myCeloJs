import { writeRankings } from '../functions/rankings/writeRankings'
import { Player, SettingsType } from '../types'
import { writeRankingsFile } from './useRankingsFile'

vi.mock('../functions/rankings/writeRankings', () => ({
    writeRankings: vi.fn<typeof writeRankings>(),
}))

const mockWriteRankings = vi.mocked(writeRankings)

const player: Player = {
    name: 'Player1',
    faction: 'german',
    teamSlot: 0,
    time: '12:00',
}

const settings: SettingsType = {
    appLocation: '/app',
    rankingsHorizontal: true,
    navbarPosition: 'top',
    fontSize: 'small',
    theme: 'dark',
}

beforeEach(() => {
    mockWriteRankings.mockClear()
})

describe('writeRankingsFile', () => {
    it('writes the players with the orientation from settings', () => {
        writeRankingsFile('coh2', [player], settings, false)

        expect(mockWriteRankings).toHaveBeenCalledWith('coh2', [player], {
            horizontal: true,
            showElo: false,
            showCountry: true,
            showAvatar: false,
            avatars: {},
        })
    })

    it('shows ELO only for a game that has it', () => {
        writeRankingsFile('coh2', [player], settings, true)
        writeRankingsFile('coh3', [player], settings, true)

        expect(mockWriteRankings).toHaveBeenNthCalledWith(1, 'coh2', [player], {
            horizontal: true,
            showElo: false,
            showCountry: true,
            showAvatar: false,
            avatars: {},
        })
        expect(mockWriteRankings).toHaveBeenNthCalledWith(2, 'coh3', [player], {
            horizontal: true,
            showElo: true,
            showCountry: true,
            showAvatar: false,
            avatars: {},
        })
    })

    it('writes an empty player list, so the overlay is cleared', () => {
        writeRankingsFile('coh2', [], settings, false)

        expect(mockWriteRankings).toHaveBeenCalledWith('coh2', [], {
            horizontal: true,
            showElo: false,
            showCountry: true,
            showAvatar: false,
            avatars: {},
        })
    })

    it('hides the country only when the setting is off', () => {
        writeRankingsFile('coh2', [player], { ...settings, rankingsShowCountry: false }, false)

        expect(mockWriteRankings).toHaveBeenCalledWith('coh2', [player], {
            horizontal: true,
            showElo: false,
            showCountry: false,
            showAvatar: false,
            avatars: {},
        })
    })

    it('passes the avatars when the avatar setting is on', () => {
        const avatars = { 1: 'https://example.com/a.jpg' }
        writeRankingsFile(
            'coh2',
            [player],
            { ...settings, rankingsShowAvatar: true },
            false,
            avatars
        )

        expect(mockWriteRankings).toHaveBeenCalledWith('coh2', [player], {
            horizontal: true,
            showElo: false,
            showCountry: true,
            showAvatar: true,
            avatars,
        })
    })

    it('does not write before the settings or players are loaded', () => {
        writeRankingsFile('coh2', [player], null, false)
        writeRankingsFile('coh2', null, settings, false)

        expect(mockWriteRankings).not.toHaveBeenCalled()
    })
})
