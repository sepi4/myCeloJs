import React from 'react'
import { useSelector } from 'react-redux'

import styled from 'styled-components'

import Rank from './Player/Rank'

const Div20 = styled.div`
    cursor: default;
    display: flex;
    justify-content: center;
    width: 20%;
    color: ${({color}) => color || 'white'};
`
const Div40 = styled.div`
    cursor: default;
    display: flex;
    justify-content: center;
    width: 40%;
    overflow: hidden;
    white-space: nowrap;
`
const Row = styled.div`
    font-size: 90%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
`

function ListDiv({
    ranksArr,
}) {

    // team ranking ------
    const tableView = useSelector(state => state.navButtons.table)
    const showAll = useSelector(state => state.navButtons.all)
    let reg = tableView ? /^Team/ : /^./

    // let rankedOnly = true // navSettings.ranked
    let rankedOnly = !showAll
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
        {ranksArr
            .map((r, i) => {
                let per = r.wins / (r.wins + r.losses) * 100
                per = per.toFixed(0) + '%'
                const totalGames = r.wins + r.losses
                const rank = r.rank <= 0 ? '-' : r.rank
                const pos = r.streak > 0
                const streak = pos
                    ? `+${r.streak}`
                    : `${r.streak}`

                return <Row key={i}>
                    <Div20 title={rank + ' of ' + r.ranktotal}>{rank}</Div20>
                    <Div40>
                        <Rank rank={r} />
                    </Div40>
                    <Div20 color={'#FFFF66'} >{per}</Div20>
                    <Div20 color={pos ? 'green' : 'red'} >{streak}</Div20>
                    <Div20>{totalGames}</Div20>
                </Row>
            })
        }
    </div>
    return listDiv
}

export default ListDiv