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

export function checkGameVersionIsCorrect(lines: string[], coh3: boolean): RegExpMatchArray | null {
    if (coh3) {
        return lines[0].match(/RelicCoH3/)
    }
    return lines[0].match(/RELICCOH2/)
}

export function getLines(lines: string[]): string[] {
    const playerLines: string[] = []
    let hasMatchStarted = false
    let foundPlayerLines = false
    let gapAfterPlayers = false

    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i]
        if (line.match('GAME --.* Player:')) {
            foundPlayerLines = true
            if (foundPlayerLines && gapAfterPlayers) {
                break
            }
            playerLines.push(line)
        } else if (line.match('Match Started.*steam.*slot.*ranking')) {
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

    if (currentUserMatches.length !== 1 || currentUserMatches[0].teamSlot === 0) {
        return players
    }

    for (const player of players) {
        player.teamSlot = player.teamSlot === 1 ? 0 : 1
    }

    return players
}

/* istanbul ignore next */
export async function readLog(coh3: boolean, fileLocation: string) {
    fileLocation = fileLocation.replace(/\\/, '\\\\')
    try {
        const data = await window.electronAPI.log.read(fileLocation)
        if (!data) {
            return []
        }

        const lines = data.split('\n')

        if (!checkGameVersionIsCorrect(lines, coh3)) {
            return []
        }

        const currentUserAlias = coh3 ? getCurrentUserAliasCoh3(lines) : getCurrentUserAlias(lines)

        const playerLines = getLines(lines)
        let players = coh3 ? getPlayersInfoCoh3(playerLines) : getPlayersInfo(playerLines)

        if (currentUserAlias) {
            players = switchTeams(players, currentUserAlias)
        }

        return players
    } catch (err) {
        console.log('Error in reading logfile:', err)
        return []
    }
}
