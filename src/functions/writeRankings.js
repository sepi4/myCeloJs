import fs from 'fs'
import { commonName, formatToStr, } from '../functions/simpleFunctions'
import countries from '../../countries.json'
import stringWidth from 'string-width'

export function writeRankings(
    players, 
    rankingsInHtml, 
    rankingsHorizontal, 
    from
) {

    let json = {
        teams: {
            team1: [],
            team2: [],
        }
    }

    console.log('writeRankings from:', from)
    players = formatToStr(players)
    // let str1 = ''
    // let str2 = ''
    function countryText(s, left, n) {
        let x = ''
        if (s.length > 0 && countries[s]) {
            x = countries[s]['alpha-3']
        }
        if (left) {
            x = x.padStart(n)
        } else {
            x = x.padEnd(n)
        }
        return x
    }

    function getLimitedWord(str, limit, padLeft) {
        let sum = 0
        let newStr = ''
        for (const x of str) {
            const sw = stringWidth(x)
            // console.log(x, sw)
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

    let rowsLeft = []
    let rowsRight = []
    for (let i = 0; i < players.length; i++) {

        const country = players[i].country ? players[i].country : ''
        const name = players[i].name
        let ranking = players[i].ranking === '-1' ? '-' : players[i].ranking
        if (!isNaN(ranking)) {
            ranking = (+ranking).toString()
        }
        const faction = players[i].faction
        const slot = Number(players[i].slot)

        const maxNameLength = 20
        if (rankingsHorizontal) {
            if (slot % 2 === 0) {
                const text = getLimitedWord(name, maxNameLength, true)
                    + " " + countryText(country, true, 5)
                    + " " + ranking.padStart(5)
                    + " " + commonName(faction).padStart(5).toUpperCase()
                rowsLeft.push(text)
            } else {
                const text = commonName(faction).padEnd(5).toUpperCase()
                    + " " + ranking.padEnd(5)
                    + " " + countryText(country, false, 5)
                    + " " + getLimitedWord(name, maxNameLength, false)
                rowsRight.push(text)
            }

        } else {

            const text = commonName(faction).padEnd(5).toUpperCase()
                + " " + ranking.padEnd(5)
                + " " + countryText(country, false, 5)
                + " " + getLimitedWord(name, maxNameLength, false)

            if (slot % 2 === 0) {
                rowsRight.push(text)
            } else {
                rowsLeft.push(text)
            }

        }


        if (slot % 2 === 0) {
            json.teams.team1.push({
                name,
                ranking,
                country,
                faction: commonName(faction),
            })
        } else {
            json.teams.team2.push({
                name,
                ranking,
                country,
                faction: commonName(faction),
            })
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

    fs.writeFile(
        './localhostFiles/rankings.json',
        JSON.stringify(json, null, 4),
        'utf-8',
        (err) => {
            if (err) {
                console.log('Error in writing rankings.json file: ', err)
            }
        },
    )
    fs.writeFile(
        './localhostFiles/rankings.txt',
        text,
        'utf-8',
        (err) => {
            if (err) {
                console.log('Error in writing rankings.txt file: ', err)
            }
        },
    )
}