import { refactronTableInfo, refactronTableInfoCoh3 } from '../../functions/refactorTableInfo'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { FactionName, Rank } from '../../types'
import styles from './TableDiv.module.css'
import TableRanksDiv from './TableRanksDiv'

function TableDiv({ ranksArr }: { ranksArr: Rank[] }) {
    const {
        navButtons: { coh3 },
    } = useNavButtonsStore()
    const [solo, factionNames] = coh3
        ? refactronTableInfoCoh3(ranksArr)
        : refactronTableInfo(ranksArr)
    const factionGrids = factionNames.map((name, i) => {
        const ii = i * 4
        const faction: FactionName = name as FactionName
        return (
            <div
                className={styles.factionGrid}
                key={name}
                style={{
                    borderRight: i % 2 === 0 ? '0.1em solid gray' : undefined,
                    borderBottom:
                        i < factionNames.length - 1 &&
                        (!coh3 || (coh3 && i < factionNames.length - 2))
                            ? '0.1em solid gray'
                            : undefined,
                }}
            >
                <TableRanksDiv solo={solo} name={faction} index={ii} />
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
