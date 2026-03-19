import { Player } from '../../types'

type MatchStartedInfo = {
    profileId: number
    steamId: number
    slot: number
    ranking: number
}

/**
 * Extracts the player data portion from a COH3 log line, stripping the timestamp/prefix.
 * Player line format: `(I) [HH:MM:SS.ms] [id]: GAME -- Human Player: <slot> <name> <profileId> <teamSlot> <faction>`
 * Returns the part after "Human Player:" — e.g. `0 sepi 21518 0 germans`
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
                // Time includes the full prefix: "(I) [HH:MM:SS.ms] [id]"
                time = [parts[0], parts[1], parts[2]].join(':')
            }

            // Player data starts after "Human Player:" (index 4 onward, one more than COH2)
            return parts.slice(4).join(':').trim()
        } else {
            // Non-player lines (e.g. Match Started): take the last colon-separated segment
            const parts = line.split(':')
            return parts[parts.length - 1].trim()
        }
    })

    return { playerDataStrings, time }
}

/**
 * Parses a "Match Started" line to extract ranking info.
 * Expected format: `Match Started - [<profileId> /steam/<steamId>], slot = <slot>, ranking = <ranking>`
 */
function parseMatchStarted(data: string): MatchStartedInfo | undefined {
    const match = data.match(
        /Match Started - \[(\d+) \/steam\/(\d+)\], slot = +(\d+), ranking = +(-?\d+)/
    )
    if (match) {
        return {
            profileId: Number(match[1]),
            steamId: Number(match[2]),
            slot: Number(match[3]),
            ranking: Number(match[4]),
        }
    }
}

/**
 * Parses a player data string into a Player object.
 * Expected format: `<slot> <name...> <profileId> <teamSlot> <faction>`
 */
function parsePlayer(
    data: string,
    time: string,
    rankings: Record<string, MatchStartedInfo>
): { slot: string; player: Player } | undefined {
    const tokens = data.split(' ')
    const slot = tokens.shift()
    const faction = tokens.pop()
    const teamSlot = tokens.pop()
    const profileId = tokens.pop()
    const name = tokens.join(' ')

    if (!slot || !faction || !teamSlot || !Number(profileId)) {
        return undefined
    }

    const pid = Number(profileId)

    return {
        slot,
        player: {
            faction,
            name,
            profileId: profileId === undefined ? -1 : pid,
            teamSlot: teamSlot === undefined ? -1 : Number(teamSlot),
            time,
            ranking: rankings[pid]?.ranking,
        },
    }
}

/**
 * Parses COH3 log lines into Player objects.
 * @param lines - log lines containing player data from warnings.log
 * @returns array of parsed players
 */
export function getPlayersInfoCoh3(lines: string[]): Player[] {
    const { playerDataStrings, time } = extractPlayerData(lines)

    if (!time) {
        return []
    }

    // Build a lookup of rankings from "Match Started" lines
    const rankings: Record<string, MatchStartedInfo> = {}
    for (const data of playerDataStrings) {
        const info = parseMatchStarted(data)
        if (info?.profileId) {
            rankings[info.profileId] = info
        }
    }

    const players: Record<string, Player> = {}

    for (const data of playerDataStrings) {
        const result = parsePlayer(data, time, rankings)
        if (result) {
            players[result.slot] = result.player
        }
    }

    return Object.values(players)
}
