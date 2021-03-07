import React from 'react'
import { useSelector } from 'react-redux'

import TableDiv from '../Table/TableDiv'
import ListDiv from '../ListDiv/ListDiv'
import History from './History'

import styled from 'styled-components'

const Div = styled.div`
    color: #ddd;
    padding: 0.5em 0;
`

const TotalDiv = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 1em;
    font-size: 80%;
`

function PlayerExtraInfo({ extraInfo, player }) {
    let ranksArr = extraInfo && extraInfo.ranks
    const navButtons = useSelector((state) => state.navButtons)

    const totalGames = (() => {
        if (!navButtons.total) {
            return null
        }
        let sum = 0
        for (const rankObj of ranksArr) {
            sum += rankObj.wins + rankObj.losses
        }
        return (
            <TotalDiv>
                <p>total games: {sum}</p>
            </TotalDiv>
        )
    })()

    return <Div>
        {totalGames}

        {navButtons.table && ranksArr &&
            <TableDiv ranksArr={ranksArr} />
        }

        <ListDiv ranksArr={ranksArr} />
        <History player={player} />
    </Div>
}

export default PlayerExtraInfo