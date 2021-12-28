/* eslint-disable indent */
// eslint-disable-next-line no-undef
let PORT = port

let preJson = {}
function factionImage(faction, reversed) {
    return `
        <div class="factionStyle ${reversed ? 'marginRight3' : 'marginLeft3'}">
            <img src="../img/${faction}.png" width="100%" height="100%" />
        </div>
    `
}
function ranking(rank) {
    return `
        <span class="rankingStyle">${rank}</span>
    `
}
function country(country) {
    return `
        <div class="countryStyle">
            ${
                country
                    ? `<img src="../img/countryFlags/${country}.png" width="100%" height="100%" />`
                    : ''
            }
        </div>
    `
}
function name(name, reversed) {
    return `
        <span class="nameStyle ${
            reversed ? 'textRight marginRight1' : 'marginLeft1'
        }">
            ${name}
        </span>
    `
}
function makeArr(arr, reversed) {
    return arr.map((p) => {
        if (reversed) {
            return `<div class="playerStyle reversed">
                        ${
                            name(p.name, reversed) +
                            country(p.country, reversed) +
                            ranking(p.ranking, reversed) +
                            factionImage(p.faction, reversed)
                        }
                    </div>`
        }
        return `<div class="playerStyle">
            ${
                factionImage(p.faction) +
                ranking(p.ranking) +
                country(p.country) +
                name(p.name)
            }
        </div>`
    })
}
function makeBody(json) {
    const isHorizontal = json.horizontal
    const arr1 = makeArr(json.teams.team1, json.horizontal)
    const arr2 = makeArr(json.teams.team2)
    return `
        <div class="bodyStyle${isHorizontal ? 'Horizontal' : ''}">
            <div class="teamStyle${isHorizontal ? 'Horizontal' : ''}">
                ${arr1.map((x) => x).join('')}</div>
            <div class="teamStyle${isHorizontal ? 'Horizontal' : ''}">
                ${arr2.map((x) => x).join('')}
            </div>
        </div>
    `
}
setInterval(() => {
    const body = document.querySelector('body')
    fetch('http://localhost:' + PORT)
        .then((response) => response.json())
        .then((json) => {
            const strJson = JSON.stringify(json, null, 4)
            if (JSON.stringify(preJson, null, 4) !== strJson) {
                console.log('change')
                preJson = json
                body.innerHTML = makeBody(json)
            }
        })
        .catch((error) => {
            console.log('error in rankings.js, catch:', error)
            body.innerHTML = ''
        })
}, 1000)
