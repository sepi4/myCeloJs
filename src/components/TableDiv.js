import React from 'react'

import { getFactionFlagLocation } from '../functions/getFactionFlagLocation'

function TableDiv({ ranksArr, }) {
    // solo ranking --------
    let ranksObj = {
        solo: {
            sov: {},
            usa: {},
            uk: {},
            wer: {},
            okw: {},
        },
        team: [],
    }

    for (const r of ranksArr) {
        let groups = r.name.match(/^(\d)v\d(.+)/)

        if (groups) {
            if (groups[2] === 'Soviet') {
                ranksObj.solo.sov[+groups[1]] = r
            } else if (groups[2] === 'AEF') {
                ranksObj.solo.usa[+groups[1]] = r
            } else if (groups[2] === 'British') {
                ranksObj.solo.uk[+groups[1]] = r
            } else if (groups[2] === 'German') {
                ranksObj.solo.wer[+groups[1]] = r
            } else if (groups[2] === 'WestGerman') {
                ranksObj.solo.okw[+groups[1]] = r
            }
        }
    }
    let solo = []
    let names = ['sov', 'wer', 'usa', 'okw', 'uk']
    for (let key of names) {
        for (let i = 1; i < 5; i++) {
            let o = ranksObj.solo[key][i]
            if (o) {
                solo.push(o)
            } else {
                solo.push(undefined)
            }
        }
    }

    let index = 0
    let s = {
        width: '20%',
        display: 'inline-block',
    }

    let tableDiv = <div style={{ marginBottom: '0.5em' }}>{names.map((name, i) =>
        <div
            key={i + name}
            style={{
                display: 'inline-block',
                width: '50%',
                fontSize: '0.7em',
                margin: '0.6em 0',
            }}
        >
            <div
                style={{
                    display: 'inline-block',
                    width: '20%',
                }}
            >
                <img
                    style={{
                        width: '2em',
                        height: '2em',
                    }}
                    src={getFactionFlagLocation(name)}
                    alt={`${name}`}
                />
            </div>
            <div
                style={{
                    display: 'inline-block',
                    width: '80%',
                }}
            >
                {[0, 1, 2, 3].map(x => {
                    let d = x + 1
                    let r = solo[index]
                    index++
                    let per = '-'
                    let totalGames = 0
                    let rank = '-'
                    let streak = '-'
                    if (r) {
                        per = r.wins / (r.wins + r.losses) * 100
                        per = per.toFixed(0) + '%'
                        totalGames = r.wins + r.losses
                        if (r.rank > 0) {
                            rank = r.rank
                        }
                        streak = r.streak
                    }

                    return <div key={x + i + 'rank'}>
                        <span style={s}>{rank}</span>
                        <span style={s}>{d}v{d}</span>
                        <span style={s}>{per}</span>
                        <span style={{
                            ...s,
                            color: Number(streak)
                                ? streak > 0
                                    ? 'lime'
                                    : 'red'
                                : 'white',
                        }}>
                            {streak > 0
                                ? '+' + streak
                                : streak
                            }
                        </span>
                        <span style={s}>{totalGames}</span>
                    </div>
                })}
            </div>
        </div>
    )}</div> 
    return tableDiv
}

export default TableDiv