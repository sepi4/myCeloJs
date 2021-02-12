let preJson = {}

function makeArr(arr) {
    return arr.map(p => {
        return `
<div class="playerStyle">
    <div class="factionStyle">
        <img src="./img/${p.faction}.png" width="100%" height="100%" />
    </div>
    <span class="rankingStyle">${p.ranking}</span>
    <div class="countryStyle">
        ${p.country 
            ? `<img src="./img/countryFlags/${p.country}.png" width="100%" height="100%" />`
            : ''
        }
    </div>
    <span class="nameStyle">${p.name}</span>
</div>`
    })
}

function makeBody(json) {
    const arr1 = makeArr(json.team1)
    const arr2 = makeArr(json.team2)

    return `<div class="bodyStyle">
        <div class="teamStyle">${arr1.map(x => x).join('')}</div>
        <div class="teamStyle">${arr2.map(x => x).join('')}</div>
    </div>
    `
}

setInterval(async () => {
    const body = document.querySelector('body')
    // try {
    //     const response = await fetch('http://localhost:2837')
    //     let json = await response.json()
    //     json = JSON.stringify(json, null, 4)
    //     body.innerHTML = `<pre>${json}</pre>`
    // } catch (error) {
    //     body.innerHTML = ''
    //     console.log('error in rankings.js, catch:', error)
    // }

    fetch('http://localhost:2837')
        .then(response => response.json())
        .then(json => {
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