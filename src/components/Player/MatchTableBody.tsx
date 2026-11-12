import { getTime } from '../../functions/utils/time'
import useText from '../../hooks/useText'
import { isTextKey } from '../../translations/translation'
import { MatchHistoryReportResult, MatchObject } from '../../types'

import styles from './MatchTableBody.module.css'

interface Props {
    players: MatchHistoryReportResult[]
    game: MatchObject
}

// COH2 reports squads killed as sqkill and COH3 as sqkilled.
const COUNTER_ORDER = [
    'dmgdone',
    'ekills',
    'edeaths',
    'sqkill',
    'sqkilled',
    'sqlost',
    'vkill',
    'vlost',
    'pcap',
    'gt',
]

function counterRank(key: string) {
    const i = COUNTER_ORDER.indexOf(key)
    return i === -1 ? COUNTER_ORDER.length : i
}

function MatchTableBody(props: Props) {
    const getText = useText()
    const infoArr = (props.game?.counters ? Object.keys(props.game.counters) : [])
        .sort((a, b) => counterRank(a) - counterRank(b) || (a > b ? 1 : -1))
        .filter(isTextKey)

    return (
        <tbody>
            {infoArr.map((key, i) => (
                <tr className={styles.row} key={`${key} ${i}`}>
                    <td className={styles.name}>{getText(key)}</td>

                    {props.players.map((p) => (
                        <td key={`${p.profile_id} ${i}`}>
                            {key === 'gt'
                                ? getTime((p.counters[key] ?? 0) * 1000)
                                : p.counters[key]}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    )
}

export default MatchTableBody
