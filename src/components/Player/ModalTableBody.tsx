import React from 'react'
import getText from '../../functions/getText'
import {
    MatchObject,
    SettingsType,
    MatchHistoryReportResult,
} from '../../types'

import styles from './ModalTableBody.module.css'

interface Props {
    settings: SettingsType
    players: MatchHistoryReportResult[]
    game: MatchObject
}

function ModalTableBody(props: Props) {
    const infoArr: string[] = (
        props.game?.counters ? Object.keys(props.game.counters) : []
    )
        .sort((a, b) => (a > b ? 1 : -1))
        .filter((k) => getText(k, props.settings) !== undefined)

    return (
        <tbody>
            {infoArr.map((key: string, i) => (
                <tr className={styles.row} key={`${key} ${i}`}>
                    <td className={styles.name}>
                        {getText(key, props.settings)}
                    </td>

                    {props.players.map((p) => (
                        <td key={`${p.profile_id} ${i}`}>{p.counters[key]}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    )
}

export default ModalTableBody
