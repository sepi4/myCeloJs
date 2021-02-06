import React from 'react'
import { useSelector } from 'react-redux'

import Rank from './Rank'

function ListDiv({ 
    ranksArr, 
    style, 
}) {

    // team ranking ------
    const tableView = useSelector(state => state.tableView)
    let reg = tableView ? /^Team/ : /^./ 
    let rankedOnly = true // navSettings.ranked
    ranksArr = ranksArr
        .filter(r => r.name.match(reg))
        .filter(r => rankedOnly ? r.rank > 0 : true)

    let pos = []
    let neg = []
    for (const r of ranksArr) {
        if (r.rank < 0) {
            neg.push(r)
        } else {
            pos.push(r)
        }
    }
    neg = neg.sort((a, b) => {
        let aTotal = a.wins + a.losses
        let bTotal = b.wins + b.losses
        return bTotal - aTotal
    })

    pos = pos.sort((a, b) => {
        let rankDiff = a.rank - b.rank
        let aTotal = a.wins + a.losses
        let bTotal = b.wins + b.losses
        if (rankDiff === 0) {
            return aTotal - bTotal
        } else {
            return rankDiff
        }
    })
    ranksArr = pos.concat(neg)

    let listDiv = ranksArr && <div style={{ 
        fontSize: '90%',
    }}>
        <div> 
            {
                ranksArr
                    .map((r, i) => {
                        let per = r.wins / (r.wins + r.losses) * 100
                        per = per.toFixed(0) + '%'
                        let totalGames = r.wins + r.losses
                        let rank = r.rank <= 0 ? '-' : r.rank

                        return <div key={i} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                        }}>
                            <div style={style}>{rank}</div>
                            <Rank
                                style={{
                                    ...style,
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                }}
                                rank={r}
                            />
                            <div style={style}>{per}</div>
                            <div style={style}>{totalGames}</div>
                        </div>
                    })
            }
        </div>
    </div>
    return listDiv
}

export default ListDiv