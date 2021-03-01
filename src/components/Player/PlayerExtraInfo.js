import React from 'react'
import { useSelector } from 'react-redux'

import styled from 'styled-components'

import TableDiv from '../Table/TableDiv'
import ListDiv from '../ListDiv/ListDiv'

const Div = styled.div`
    color: #ddd;
    padding: 0.5em 0;
`

function PlayerExtraInfo({
    extraInfo,
}) {
    let ranksArr = extraInfo && extraInfo.ranks
    const navButtons = useSelector(state => state.navButtons)

    return <Div>
        <div style={{
            margin: '1em 0',
        }}>
            <button onClick={() => console.log(extraInfo)}>kissa</button>
        </div>

        {navButtons.table && ranksArr &&
            <TableDiv ranksArr={ranksArr} />
        }
        <ListDiv ranksArr={ranksArr} />
    </Div>

}

export default PlayerExtraInfo