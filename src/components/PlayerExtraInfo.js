import React from 'react'
import { useSelector } from 'react-redux'

import styled from 'styled-components'

import TableDiv from './TableDiv'
import ListDiv from './ListDiv'

const Div = styled.div`
    color: white;
    padding: 0.5em 0;
`

function PlayerExtraInfo({ 
    extraInfo, 
}) {
    let ranksArr = extraInfo && extraInfo.ranks
    const tableView = useSelector(state => state.table)

    return <Div>
        {tableView && ranksArr &&
            <TableDiv ranksArr={ranksArr} />
        }
        <ListDiv ranksArr={ranksArr} />
    </Div>

}

export default PlayerExtraInfo