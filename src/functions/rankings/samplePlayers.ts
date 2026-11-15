import { Game } from '../../constants/games'
import { Player } from '../../types'

const SIDES: Record<Game, { allies: string[]; axis: string[] }> = {
    coh2: { allies: ['soviet', 'aef', 'british'], axis: ['german', 'west_german'] },
    coh3: { allies: ['americans', 'british_africa'], axis: ['germans', 'afrika_korps'] },
}

const COUNTRIES = ['fi', 'de', 'us', 'gb', 'pl', 'fr', 'br', 'se']
const RANKINGS = [12, 245, undefined, 1830, 87, undefined, 512, 3301]
const RATINGS = [1620, 1410, undefined, 1105, 1515, undefined, 1290, 980]

/** A made-up 4v4 game for the overlay preview when the log has no players. */
export function samplePlayers(game: Game): Player[] {
    const { allies, axis } = SIDES[game]
    return COUNTRIES.map((country, i) => {
        const team = i % 2 === 0 ? allies : axis
        const slotInTeam = Math.floor(i / 2)
        return {
            name: `Player ${i + 1}`,
            profileId: i + 1,
            country,
            faction: team[slotInTeam % team.length]!,
            ranking: RANKINGS[i],
            rating: RATINGS[i],
            teamSlot: i,
            time: '',
        }
    })
}

const SAMPLE_AVATAR =
    'data:image/svg+xml,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">' +
            '<rect width="16" height="16" fill="#8a8a8a"/>' +
            '<circle cx="8" cy="6" r="3" fill="#d0d0d0"/>' +
            '<path d="M2 16c0-4 3-6 6-6s6 2 6 6z" fill="#d0d0d0"/>' +
            '</svg>'
    )

/** The same placeholder avatar for every sample player, by profile ID. */
export function sampleAvatars(): Record<number, string> {
    return Object.fromEntries(COUNTRIES.map((_, i) => [i + 1, SAMPLE_AVATAR]))
}
