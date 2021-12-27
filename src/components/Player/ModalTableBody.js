import React from 'react'
import getText from '../../functions/getText'

import styles from './ModalTableBody.module.css'

function ModalTableBody({ game, settings, players }) {
    const infoArr = Object.keys(game.counters)
        .sort((a, b) => (a > b ? 1 : -1))
        .filter((k) => getText(k, settings) !== undefined)

    return (
        <tbody>
            {infoArr.map((k, i) => (
                <tr className={styles.row} key={`${k} ${i}`}>
                    <td className={styles.name}>{getText(k, settings)}</td>

                    {players.map((p) => (
                        <td key={`${p.profile_id} ${i}`}>{p.counters[k]}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    )
}

export default ModalTableBody
