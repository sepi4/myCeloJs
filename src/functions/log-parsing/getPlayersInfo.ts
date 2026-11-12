import { Player } from '../../types'
import { parseProfileId, splitPlayerData } from './splitPlayerData'

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
        const fields = splitPlayerData(data)
        if (fields) {
            players[fields.slot] = {
                faction: fields.faction,
                name: fields.name,
                profileId: parseProfileId(fields.profileId),
                teamSlot: Number(fields.teamSlot),
                time,
            }
        }
    }

    return Object.values(players)
}
