import fs from 'fs'
import { commonName, formatToStr, } from '../functions/simpleFunctions'

export function writeRankings(players, rankingsInHtml, from) {

    let json = {
        team1: [],
        team2: [],
    }

    console.log('writeRankings from:', from)
    players = formatToStr(players)
    let str1 = ''
    let str2 = ''
    for (let i = 0; i < players.length; i++) {

        const country = players[i].country ? players[i].country : ''
        const name = players[i].name
        let ranking = players[i].ranking === '-1' ? '-' : players[i].ranking
        if (!isNaN(ranking)) {
            ranking = (+ranking).toString()
        }
        const faction = players[i].faction
        const slot = Number(players[i].slot)

        const text = commonName(faction).padEnd(5)
            + " " + ranking.padEnd(5)
            + " " + country.padEnd(5)
            + " " + name + " \n"

        if (slot % 2 === 0) {
            str1 += text
        } else {
            str2 += text
        }


        if (slot % 2 === 0) {
            json.team1.push({
                name,
                ranking,
                country,
                faction: commonName(faction),
            })
        } else {
            json.team2.push({
                name,
                ranking,
                country,
                faction: commonName(faction),
            })
        }

    }

    const text = str1 + '\n' + str2
    fs.writeFile(
        './rankings.json',
        JSON.stringify(json, null, 4),
        'utf-8',
        (err) => {
            if (err) {
                console.log('Error in writing rankings.json file: ', err)
            }
        },
    )
    fs.writeFile(
        './rankings.txt',
        text,
        'utf-8',
        (err) => {
            if (err) {
                console.log('Error in writing rankings.txt file: ', err)
            }
        },
    )
}