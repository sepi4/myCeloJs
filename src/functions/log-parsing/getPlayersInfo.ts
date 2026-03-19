import { Player } from '../../types'

/**
 * Extracts the player data portion from a log line, stripping the timestamp/prefix.
 *
 * Player line format: `HH:MM:SS.ms   GAME -- Human Player: <slot> <name> <profileId> <teamSlot> <faction>`
 *
 * Returns the part after "Player:" — e.g. `2 sepi 580525 0 soviet`
 */
function extractPlayerData(lines: string[]): {
    playerDataStrings: string[]
    time: string | undefined
} {
    let time: string | undefined

    const playerDataStrings: string[] = lines.map((line) => {
        if (line.match(/GAME --.* Player:/)) {
            const parts = line.split(':')
            if (time === undefined) {
                // Time is in the first three colon-separated segments: "HH:MM:SS.ms"
                time = [parts[0], parts[1], parts[2].split('   ')[0]].join(':')
            }

            // Player data starts after "Player:" (index 3 onward)
            return parts.slice(3).join(':').trim()
        } else {
            // Non-player lines (e.g. Match Started): take the last colon-separated segment
            const parts = line.split(':')
            return parts[parts.length - 1].trim()
        }
    })

    return { playerDataStrings, time }
}

/**
 * Parses a player data string into a Player object.
 *
 * Expected format: `<slot> <name...> <profileId> <teamSlot> <faction>`
 */
function parsePlayer(data: string, time: string): { slot: string; player: Player } | undefined {
    const tokens = data.split(' ')
    const slot = tokens.shift()
    const faction = tokens.pop()
    const teamSlot = tokens.pop()
    const profileId = tokens.pop()
    const name = tokens.join(' ')

    if (!slot || !faction || !teamSlot) {
        return undefined
    }

    return {
        slot,
        player: {
            faction,
            name,
            profileId: profileId === undefined ? -1 : Number(profileId),
            teamSlot: teamSlot === undefined ? -1 : Number(teamSlot),
            time,
            ranking: -1,
        },
    }
}

/**
 * Parses COH2 log lines into Player objects.
 *
 * @param lines - log lines containing player data from warnings.log
 * @returns array of parsed players
 */
export function getPlayersInfo(lines: string[]): Player[] {
    const { playerDataStrings, time } = extractPlayerData(lines)

    if (!time) {
        return []
    }

    const players: Record<string, Player> = {}

    for (const data of playerDataStrings) {
        const result = parsePlayer(data, time)
        if (result) {
            players[result.slot] = result.player
        }
    }

    return Object.values(players)
}
