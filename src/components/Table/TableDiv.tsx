import { refactronTableInfo, refactronTableInfoCoh3 } from '../../functions/refactorTableInfo'
import TableRanksDiv from './TableRanksDiv'

import styles from './TableDiv.module.css'

import { FactionName, Rank } from '../../types'
import { useAppSelector } from '../../hooks/customReduxHooks'

function TableDiv({ ranksArr }: { ranksArr: Rank[] }) {
    const coh3 = useAppSelector((state) => state.navButtons.coh3)
    const [solo, factionNames] = coh3 ? refactronTableInfoCoh3(ranksArr) : refactronTableInfo(ranksArr)
    let index = 0

    const factionGrids = factionNames.map((name, i) => {
        const ii = index
        index += 4
        const faction: FactionName = name as FactionName
        return (
            <div
                className={styles.factionGrid}
                key={name}
                style={{
                    borderRight: i % 2 === 0 ? '0.1em solid gray' : undefined,
                    borderBottom:
                        i < factionNames.length - 1 && (!coh3 || (coh3 && i < factionNames.length - 2))
                            ? '0.1em solid gray'
                            : undefined,
                }}
            >
                <TableRanksDiv solo={solo} name={faction} index={ii} />
            </div>
        )
    })

    return <div className={styles.container}>{factionGrids}</div>
}

export default TableDiv
