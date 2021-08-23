import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import styles from './FoundPlayer.module.css'

export default function FoundPlayer({ player, clickFun }) {
    const state = useSelector(state => state)
    const countryFlags = state.countryFlags

    const settings = state.settings

    const lg = settings && settings.language ? settings.language : 'en'
    const timeAgo = player.lastGameTime
        ? moment(player.lastGameTime * 1000).locale(lg).fromNow()
        : '-'

    // alias: "Sepi"
    // country: "de"
    // leaderboardregion_id: 0
    // level: 27
    // name: "/steam/76561198002332458"
    // personal_statgroup_id: 6874570
    // profile_id: 4578968
    // xp: 437372

    return (
        <div className={styles.container} onClick={clickFun}>
            <div>
                <img
                    className={styles.flagImage}
                    src={countryFlags[player.country]}
                    alt={`${player.country}`}
                />
                <span className={styles.alias}>
                    {player.alias}
                </span>

            </div>

            <table className={styles.table}>
                <tbody>
                    <tr>
                        <th className={styles.label}>MP games:</th>
                        <td>{player.totalGames}</td>
                    </tr>
                    <tr>
                        <th className={styles.label}>last game:</th>
                        <td>{timeAgo}</td>
                    </tr>
                </tbody>
            </table>

        </div>
    )
}
