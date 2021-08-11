import React from 'react'

import { refactronTableInfo } from '../../functions/refactorTableInfo'
import TableRanksDiv from './TableRanksDiv'

import styles from './TableDiv.module.css'

function TableDiv({ ranksArr, }) {
    const [solo, names] = refactronTableInfo(ranksArr)
    let index = 0

    const factionGrids = names.map((name, i) => {
        const ii = index
        index += 4
        return (
            <div
                className={styles.factionGrid}
                key={i + name}
                style={{
                    borderRight: i % 2 === 0 ? '0.1em solid gray' : null,
                    borderBottom: i < names.length - 1
                        ? '0.1em solid gray'
                        : null,
                }}
            >
                <TableRanksDiv
                    solo={solo}
                    name={name}
                    index={ii}
                />
            </div>
        )
    })

    return <div className={styles.container}>
        {factionGrids}
    </div>
}

export default TableDiv