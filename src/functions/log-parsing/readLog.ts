import { Game, GAME_CONFIG } from '../../constants/games'
import { Player } from '../../types'
import { getPlayersInfo } from './getPlayersInfo'
import { getPlayersInfoCoh3 } from './getPlayersInfoCoh3'

export function getCurrentUserAlias(lines: string[]): string | undefined {
    for (const line of lines) {
        const match = line.match(/GAME -- Current user name is \[(.+)\]/)
        if (match) {
            return match[1]
        }
    }
}

export function getCurrentUserAliasCoh3(lines: string[]): string | undefined {
    for (const line of lines) {
        const match = line.match(/GAME -- Current Steam name is \[(.+)\]/)
        if (match) {
            return match[1]
        }
    }
}

export function checkGameVersionIsCorrect(lines: string[], game: Game): boolean {
    return GAME_CONFIG[game].logHeader.test(lines[0] ?? '')
}

const logParsers: Record<
    Game,
    {
        getCurrentUserAlias: (lines: string[]) => string | undefined
        getPlayersInfo: (playerLines: string[]) => Player[]
    }
> = {
    coh2: { getCurrentUserAlias, getPlayersInfo },
    coh3: { getCurrentUserAlias: getCurrentUserAliasCoh3, getPlayersInfo: getPlayersInfoCoh3 },
}

// skip these lines, this is relic bug in log files (probably temp)
const BROKEN_PLAYER_LINE = /GAME -- Human Player: 0  -2 (0|1) (frontend|americans)/
const PLAYER_LINE = /GAME --.* Player:/
const MATCH_STARTED_LINE = /Match Started.*steam.*slot.*ranking/

export function getLines(lines: string[]): string[] {
    const playerLines: string[] = []
    let hasMatchStarted = false
    let foundPlayerLines = false
    let gapAfterPlayers = false

    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i] ?? ''

        if (BROKEN_PLAYER_LINE.test(line)) {
            continue
        }

        if (PLAYER_LINE.test(line)) {
            foundPlayerLines = true
            if (foundPlayerLines && gapAfterPlayers) {
                break
            }
            playerLines.push(line)
        } else if (MATCH_STARTED_LINE.test(line)) {
            hasMatchStarted = true
            playerLines.push(line)
        } else if (hasMatchStarted) {
            break
        } else if (foundPlayerLines) {
            gapAfterPlayers = true
        }
    }

    return playerLines
}

export function switchTeams(players: Player[], currentUser: string): Player[] {
    const currentUserMatches = players.filter(
        (player) => player.name === currentUser && player.profileId
    )

    if (currentUserMatches.length !== 1 || currentUserMatches[0]?.teamSlot === 0) {
        return players
    }

    for (const player of players) {
        player.teamSlot = player.teamSlot === 1 ? 0 : 1
    }

    return players
}

/* istanbul ignore next */
export async function readLog(game: Game, fileLocation: string) {
    try {
        const data = await window.electronAPI.log.read(fileLocation)
        if (!data) {
            return []
        }

        const lines = data.split('\n')

        if (!checkGameVersionIsCorrect(lines, game)) {
            return []
        }

        const parser = logParsers[game]
        const currentUserAlias = parser.getCurrentUserAlias(lines)

        const playerLines = getLines(lines)
        let players = parser.getPlayersInfo(playerLines)

        if (currentUserAlias) {
            players = switchTeams(players, currentUserAlias)
        }

        return players
    } catch (err) {
        console.log('Error in reading logfile:', err)
        return []
    }
}
