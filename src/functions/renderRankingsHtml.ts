import { RankingsJson } from '../types'

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

function renderPlayer(
    player: { name: string; ranking: string; country?: string; faction: string },
    reversed: boolean
): string {
    const factionImg = `<div class="factionStyle ${reversed ? 'marginRight3' : 'marginLeft3'}"><img src="/img/${escapeHtml(player.faction)}.png" width="100%" height="100%" /></div>`
    const rankSpan = `<span class="rankingStyle">${escapeHtml(player.ranking)}</span>`
    const countryDiv = `<div class="countryStyle">${player.country ? `<img src="/img/countryFlags/${escapeHtml(player.country)}.png" width="100%" height="100%" />` : ''}</div>`
    const nameSpan = `<span class="nameStyle ${reversed ? 'textRight marginRight1' : 'marginLeft1'}">${escapeHtml(player.name)}</span>`

    if (reversed) {
        return `<div class="playerStyle reversed">${nameSpan}${countryDiv}${rankSpan}${factionImg}</div>`
    }
    return `<div class="playerStyle">${factionImg}${rankSpan}${countryDiv}${nameSpan}</div>`
}

export function renderRankingsBody(data: RankingsJson): string {
    const h = data.horizontal
    const team1 = data.teams.team1.map((p) => renderPlayer(p, h)).join('')
    const team2 = data.teams.team2.map((p) => renderPlayer(p, false)).join('')

    return `<div class="bodyStyle${h ? 'Horizontal' : ''}"><div class="teamStyle${h ? 'Horizontal' : ''}">${team1}</div><div class="teamStyle${h ? 'Horizontal' : ''}">${team2}</div></div>`
}

const CSS = `* {
    margin: 0;
    padding: 0;
    font-family: 'Work Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
    font-size: 32px;
    color: white;
}
.bodyStyle {
    font-family: 'Work Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
}
.bodyStyleHorizontal {
    font-family: 'Work Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
    display: flex;
}
.teamStyle {
    margin-bottom: 1em;
}
.teamStyleHorizontal {
    width: 50%;
}
.reversed {
    display: flex;
    justify-content: flex-end;
}
.playerStyle {
    display: flex;
    align-items: center;
}
.factionStyle {
    width: 1.6em;
    height: 1.6em;
    min-width: 1.6em;
    display: inline-block;
}
.rankingStyle {
    width: 3.5em;
    min-width: 3.5em;
    display: flex;
    justify-content: center;
}
.countryStyle {
    width: 1.4em;
    min-width: 1.4em;
    display: inline-block;
    display: flex;
    align-items: center;
}
.nameStyle {
    white-space: nowrap;
    overflow: hidden;
}
.textRight {
    text-align: right;
}
.marginLeft1 {
    margin-left: 1em;
}
.marginLeft3 {
    margin-left: 3em;
}
.marginRight1 {
    margin-right: 1em;
}
.marginRight3 {
    margin-right: 3em;
}`

export function renderRankingsPage(): string {
    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>rankings</title>
    <style>${CSS}</style>
</head>
<body>
    <script>
        const evtSource = new EventSource('/events')
        evtSource.onmessage = (event) => {
            document.body.innerHTML = event.data
        }
    </script>
</body>
</html>`
}
