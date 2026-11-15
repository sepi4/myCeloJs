import { Game } from '../../constants/games'
import { PLACEHOLDER_AVATAR } from '../../constants/placeholderAvatar'
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

/** The same placeholder avatar for every sample player, by profile ID. */
export function sampleAvatars(): Record<number, string> {
    return Object.fromEntries(COUNTRIES.map((_, i) => [i + 1, PLACEHOLDER_AVATAR]))
}
