import { RankingsJson } from '../../types'
import { RANKINGS_CSS } from './rankingsCss'

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

function img(src: string): string {
    return `<img src="${src}" width="100%" height="100%" />`
}

function renderPlayer(
    player: { name: string; ranking: string; country?: string; faction: string; rating?: number },
    reversed: boolean
): string {
    const faction = escapeHtml(player.faction)
    const name = escapeHtml(player.name)
    const ranking = escapeHtml(player.ranking)
    const country = player.country ? escapeHtml(player.country) : ''

    const factionMargin = reversed ? 'marginRight3' : 'marginLeft3'
    const nameMargin = reversed ? 'textRight marginRight1' : 'marginLeft1'

    const factionDiv = `<div class="factionStyle ${factionMargin}" data-testid="faction">
        ${img(`/img/${faction}.png`)}
    </div>`
    const rankSpan = `<span class="rankingStyle" data-testid="ranking">
        ${ranking}
    </span>`
    const eloSpan =
        player.rating !== undefined
            ? `<span class="eloStyle" data-testid="elo">(${player.rating})</span>`
            : ''
    const countryDiv = `<div class="countryStyle" data-testid="country">
        ${country ? img(`/img/countryFlags/${country}.png`) : ''}
    </div>`
    const nameSpan = `<span class="nameStyle ${nameMargin}" data-testid="name">
        ${name}
    </span>`

    const parts = reversed
        ? [nameSpan, countryDiv, eloSpan, rankSpan, factionDiv]
        : [factionDiv, rankSpan, eloSpan, countryDiv, nameSpan]

    const cls = reversed ? 'playerStyle reversed' : 'playerStyle'
    return `<div class="${cls}" data-testid="player">${parts.join('')}</div>`
}

export function renderRankingsBody(data: RankingsJson): string {
    const h = data.horizontal
    const suffix = h ? 'Horizontal' : ''

    const team1 = data.teams.team1.map((p) => renderPlayer(p, h)).join('')
    const team2 = data.teams.team2.map((p) => renderPlayer(p, false)).join('')

    return [
        `<div class="bodyStyle${suffix}">`,
        `<div class="teamStyle${suffix}" data-testid="team">${team1}</div>`,
        `<div class="teamStyle${suffix}" data-testid="team">${team2}</div>`,
        `</div>`,
    ].join('')
}

export function renderRankingsTxtBody(text: string): string {
    const lines = text.split('\n').map((line) => escapeHtml(line))
    return `<pre style="font-family: 'Work Sans', monospace; font-size: 16px; color: white; margin: 0;">${lines.join('<br>')}</pre>`
}

export function renderRankingsPage(): string {
    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>rankings</title>
    <style>${RANKINGS_CSS}</style>
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
