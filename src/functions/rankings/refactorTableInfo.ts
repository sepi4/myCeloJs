import { Game, GAME_CONFIG } from '../../constants/games'
import { Rank } from '../../types'

const TEAM_SIZES = 4

/**
 * Returns the solo ranks as a flat list of four team sizes per faction,
 * and the faction codes in the same order.
 */
export function refactorTableInfo(game: Game, ranks: Rank[]): [(Rank | undefined)[], string[]] {
    const { factions } = GAME_CONFIG[game]
    const solo: (Rank | undefined)[] = Array(factions.length * TEAM_SIZES).fill(undefined)

    for (const rank of ranks) {
        const match = rank.name.match(/^(\d)v\d(.+?)(Unranked)?$/)
        if (!match) {
            continue
        }
        const teamSize = Number(match[1])
        const factionIndex = factions.findIndex((f) => f.leaderboardName === match[2])
        if (factionIndex !== -1 && teamSize >= 1 && teamSize <= TEAM_SIZES) {
            solo[factionIndex * TEAM_SIZES + teamSize - 1] = rank
        }
    }

    return [solo, factions.map((f) => f.code)]
}
