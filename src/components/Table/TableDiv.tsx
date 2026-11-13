import { groupSoloRanksByFaction } from '../../functions/rankings/groupSoloRanksByFaction'
import { useDisplayGame } from '../../hooks/useDisplayGame'
import { Rank } from '../../types'
import TableRanksDiv from './TableRanksDiv'

import styles from './TableDiv.module.css'

function TableDiv({ ranks }: { ranks: Rank[] }) {
    const game = useDisplayGame()
    const [soloRanks, factionNames] = groupSoloRanksByFaction(game, ranks)
    const lastRowSize = factionNames.length % 2 === 0 ? 2 : 1
    const factionGrids = factionNames.map((faction, factionIndex) => {
        const startIndex = factionIndex * 4
        return (
            <div
                className={styles.factionGrid}
                key={faction}
                style={{
                    borderRight: factionIndex % 2 === 0 ? '0.1em solid gray' : undefined,
                    borderBottom:
                        factionIndex < factionNames.length - lastRowSize
                            ? '0.1em solid gray'
                            : undefined,
                }}
            >
                <TableRanksDiv ranks={soloRanks} faction={faction} startIndex={startIndex} />
            </div>
        )
    })

    return (
        <div data-testid="table-view" className={styles.container}>
            {factionGrids}
        </div>
    )
}

export default TableDiv
