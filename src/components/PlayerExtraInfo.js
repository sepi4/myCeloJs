import React from 'react'
import { useSelector } from 'react-redux'

import TableDiv from './TableDiv'
import ListDiv from './ListDiv'

function PlayerExtraInfo({ 
    style, 
    extraInfo, 
}) {
    let ranksArr = extraInfo && extraInfo.ranks

    style = {
        ...style,
        fontSize: '90%',
        marginRight: '0.5em',
    }

    const tableView = useSelector(state => state.tableView)

    return <div style={{
        color: 'white',
        padding: '0.5em 0em 0.5em 1em',
    }}>

        { tableView && <TableDiv ranksArr={ranksArr} /> } 

        <ListDiv 
            ranksArr={ranksArr} 
            style={style} 
        />
    </div>

}

export default PlayerExtraInfo