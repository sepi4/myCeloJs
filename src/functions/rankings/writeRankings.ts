import stringWidth from 'string-width'

import { Game, getFactionCode } from '../../constants/games'
import countriesJson from '../../translations/countries.json'
import { Player, RankingsJson } from '../../types'

interface Countries {
    [key: string]: {
        ['name']: string
        ['alpha-2']: string
        ['alpha-3']: string
        ['country-code']: string
        ['iso_3166-2']: string
        ['region']: string
        ['sub-region']: string
        ['intermediate-region']: string
        ['region-code']: string
        ['sub-region-code']: string
        ['intermediate-region-code']: string
    }
}

const countries: Countries = countriesJson

function countryText(s: string | undefined, left: boolean, n: number) {
    let x = ''
    if (s && s.length > 0 && countries[s]) {
        x = countries[s]['alpha-3']
    }
    if (left) {
        x = x.padStart(n)
    } else {
        x = x.padEnd(n)
    }
    return x
}

function getLimitedWord(str: string, limit: number, padLeft: boolean) {
    let sum = 0
    let newStr = ''
    for (const x of str) {
        const sw = stringWidth(x)
        if (sum + sw <= limit) {
            sum += sw
            newStr += x
        } else {
            break
        }
    }
    if (padLeft) {
        newStr = ' '.repeat(limit - sum) + newStr
        return newStr
    }
    return newStr + ' '.repeat(limit - sum)
}

export function buildRankings(
    game: Game,
    players: Player[],
    rankingsHorizontal: boolean,
    showElo: boolean = false
): { json: RankingsJson; text: string } {
    const json: RankingsJson = {
        teams: {
            team1: [],
            team2: [],
        },
        horizontal: false,
    }

    const rowsLeft = []
    const rowsRight = []
    for (let i = 0; i < players.length; i++) {
        const country = players[i].country ? players[i].country : ''
        const name = players[i].name

        let ranking = players[i].ranking === -1 ? '-' : players[i].ranking?.toString()

        if (ranking === undefined) {
            ranking = '-'
        }

        const faction = players[i].faction
        const teamSlot = Number(players[i].teamSlot)
        const ratingPad =
            showElo && players[i].rating !== undefined ? `(${players[i].rating!})`.padEnd(7) : ''

        const factionCode = getFactionCode(game, faction)
        const maxNameLength = 20
        if (rankingsHorizontal) {
            if (teamSlot % 2 === 0) {
                const text =
                    getLimitedWord(name, maxNameLength, true) +
                    ' ' +
                    countryText(country, true, 5) +
                    ' ' +
                    (ratingPad ? ratingPad.trimEnd().padStart(7) + ' ' : '') +
                    ranking.padStart(5) +
                    ' ' +
                    factionCode.padStart(5).toUpperCase()
                rowsLeft.push(text)
            } else {
                const text =
                    factionCode.padEnd(5).toUpperCase() +
                    ' ' +
                    ranking.padEnd(5) +
                    (ratingPad ? ' ' + ratingPad : '') +
                    ' ' +
                    countryText(country, false, 5) +
                    ' ' +
                    getLimitedWord(name, maxNameLength, false)
                rowsRight.push(text)
            }
        } else {
            const text =
                factionCode.padEnd(5).toUpperCase() +
                ' ' +
                ranking.padEnd(5) +
                (ratingPad ? ' ' + ratingPad : '') +
                ' ' +
                countryText(country, false, 5) +
                ' ' +
                getLimitedWord(name, maxNameLength, false)

            if (teamSlot % 2 === 0) {
                rowsRight.push(text)
            } else {
                rowsLeft.push(text)
            }
        }

        const ratingValue = showElo ? players[i].rating : undefined
        const teamEntry = {
            name,
            ranking,
            country,
            // The overlay loads /img/<faction>.png, and the COH3 images are named by the log name.
            faction: game === 'coh3' ? faction : factionCode,
            ...(ratingValue !== undefined ? { rating: ratingValue } : {}),
        }
        if (teamSlot % 2 === 0) {
            json.teams.team1.push(teamEntry)
        } else {
            json.teams.team2.push(teamEntry)
        }
    }

    json.horizontal = rankingsHorizontal

    let text = ''
    if (rankingsHorizontal) {
        for (let i = 0; i < rowsLeft.length; i++) {
            text += rowsLeft[i] + '           ' + rowsRight[i] + '\n'
        }
    } else {
        for (let i = 0; i < rowsLeft.length; i++) {
            text += rowsLeft[i] + '\n'
        }
        text += '\n'
        for (let i = 0; i < rowsRight.length; i++) {
            text += rowsRight[i] + '\n'
        }
    }

    return { json, text }
}

export function writeRankings(
    game: Game,
    players: Player[],
    rankingsHorizontal = false,
    showElo: boolean = false
): void {
    const { json, text } = buildRankings(game, players, rankingsHorizontal, showElo)
    window.electronAPI.rankings.write(JSON.stringify(json, null, 4), text)
}
