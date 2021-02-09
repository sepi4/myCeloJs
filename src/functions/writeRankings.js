import fs from 'fs'
import { commonName, formatToStr, } from '../functions/simpleFunctions'


export function writeRankings(players, rankingsInHtml, from) {

    let arr1 = []
    let arr2 = []

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

        const imgDivStyle = `
width: 64px;
height: 64px;
display: inline-block;
        `
        const countryDivStyle = `
width: 50px;
display: inline-block;
display: flex;
align-items: center;
        `
        const rankingStyle = `
margin-left: 1em;
width: 100px;
        `
        const nameStyle = `
margin-left: 1em;
width: 500px;
white-space: nowrap;
overflow: hidden;
        `
        const playerDivStyle = `
display: flex;
align-items: center;
        `

        const div = `
<div style="${playerDivStyle}">
    <div style="${imgDivStyle}">
        <img src="./img/${commonName(faction)}.png" width="100%" height="100%" />
    </div>
    <span style="${rankingStyle}">${ranking}</span>
    <div style="${countryDivStyle}">
        ${country ?
            `<img src="./img/countryFlags/${country}.png" width="100%" height="100%" />`
            : ''
        }
    </div>
    <span style="${nameStyle}">${name}</span>
 </div>`

        if (slot % 2 === 0) {
            arr1.push(div)
        } else {
            arr2.push(div)
        }
    }

    const bodyStyle = `
font-family: 'Work Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
margin: 0.2em;
color:white; 
    `

    const teamDivStyle = `
        margin-bottom: 1em;
    `
    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="content-type" content="text-html; charset=utf-8">
    <meta http-equiv="refresh" content="2"></meta>
    <style>
        * {
            margin: 0;
            padding: 0;
            font-family: 'Work Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial,
            sans-serif;
            font-size: 36px;
        }

    </style>
</head>
<body style="${bodyStyle}">
    <div style="${teamDivStyle}">${arr1.map(x => x).join('')}</div>
    <div style="${teamDivStyle}">${arr2.map(x => x).join('')}</div>
</body>
</html>
`

    const text = str1 + '\n' + str2
    fs.writeFile(
        rankingsInHtml ? './rankings.html' : './rankings.txt',
        rankingsInHtml ? html : text,
        'utf-8',
        (err) => {
            if (err) {
                console.log('Error in writing rankings.txt file: ', err)
            }
        },
    )
}