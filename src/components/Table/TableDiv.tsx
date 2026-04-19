import {
    refactronTableInfo,
    refactronTableInfoCoh3,
} from '../../functions/rankings/refactorTableInfo'
import { useDisplayCoh3 } from '../../hooks/useDisplayCoh3'
import { Rank } from '../../types'
import styles from './TableDiv.module.css'
import TableRanksDiv from './TableRanksDiv'

function TableDiv({ playerRanks }: { playerRanks: Rank[] }) {
    const coh3 = useDisplayCoh3()
    const [ranks, factionNames] = coh3
        ? refactronTableInfoCoh3(playerRanks)
        : refactronTableInfo(playerRanks)
    const factionGrids = factionNames.map((faction, factionIndex) => {
        const startIndex = factionIndex * 4
        return (
            <div
                className={styles.factionGrid}
                key={faction}
                style={{
                    borderRight: factionIndex % 2 === 0 ? '0.1em solid gray' : undefined,
                    borderBottom:
                        factionIndex < factionNames.length - 1 &&
                        (!coh3 || (coh3 && factionIndex < factionNames.length - 2))
                            ? '0.1em solid gray'
                            : undefined,
                }}
            >
                <TableRanksDiv ranks={ranks} faction={faction} startIndex={startIndex} />
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
