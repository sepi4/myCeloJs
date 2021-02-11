import React from 'react'

import { refactronTableInfo } from '../../functions/refactorTableInfo'
import TableRanksDiv from './TableRanksDiv'

function TableDiv({ ranksArr, }) {
    const [solo, names] = refactronTableInfo(ranksArr)
    let index = 0

    return <div
        style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: '0.5em', 
        }}
    >{names.map((name, i) => {

        const ii = index
        index += 4

        return <div
            key={i + name}
            style={{
                width: '49%',
                display: 'grid',
                gridTemplate: '1fr / repeat(6, 1fr)',
                fontSize: '0.7em',
                padding: '0.6em 0',
                borderRight: i % 2 === 0 ? '0.1em solid gray' : null,
                borderBottom: i < names.length - 1 ? '0.1em solid gray' : null,
            }}
        >
            <TableRanksDiv 
                solo={solo}
                name={name}
                index={ii}
            />
        </div>

    })}</div> 
}

export default TableDiv