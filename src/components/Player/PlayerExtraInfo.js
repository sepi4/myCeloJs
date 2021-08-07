import React from 'react'
import { useSelector } from 'react-redux'

import TableDiv from '../Table/TableDiv'
import ListDiv from '../ListDiv/ListDiv'
import History from './History'

import getText from '../../functions/getText'

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
    const state = useSelector(state => state)
    const navButtons = state.navButtons
    const settings = state.settings
    // const lg = settings ? settings.language : 'en'

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
                <p>{getText('total_games', settings)}: {sum}</p>
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