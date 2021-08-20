import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Members.module.css'

import { getExtraInfo } from '../../functions/getExtraInfo'

function Members({ members }) {
    const state = useSelector(state => state)
    const countryFlags = state.countryFlags
    const dispatch = useDispatch()

    const handlePlayerCardOn = (player) => {
        player = {
            name: player.alias,
            country: player.country,
            profileId: player.profile_id,
        }

        // debugger

        // alias: "Maximus Decimus Meridius"
        // country: "ru"
        // leaderboardregion_id: 0
        // level: 300
        // name: "/steam/76561198309343528"
        // personal_statgroup_id: 4232750
        // profile_id: 2894783
        // xp: 18785964

        getExtraInfo([player], (result) => {
            const ex = result[player.profileId]
            if (result && ex) {
                dispatch({
                    type: 'PLAYER_CARD_ON',
                    data: {
                        player,
                        extraInfo: ex,
                    }
                })
            }
        }, true)
    }

    return <div style={{ margin: '0.5rem 0' }}>
        <hr />
        {members.map(m => (
            <div
                className={styles.membersDiv}
                key={m.name}
                onClick={() => handlePlayerCardOn(m)}
            >
                <img
                    className={styles.flagImage}
                    src={countryFlags[m.country]}
                    alt={`${m.country}`}
                />

                {m.alias}
            </div>
        ))}
    </div>
}

export default Members