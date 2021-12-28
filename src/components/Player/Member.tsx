import React from 'react'
import styles from './Members.module.css'

import { getExtraInfo } from '../../functions/getExtraInfo'
import { useAppDispatch, useAppSelector } from '../../hooks/customReduxHooks'
import { Member, Player } from '../../types'

interface Props {
    member: Member
}

export default function Member(props: Props) {
    const state = useAppSelector((state) => state)
    const countryFlags = state.countryFlags
    const dispatch = useAppDispatch()

    const handlePlayerCardOn = (p: Member) => {
        const newPlayer: Player = {
            country: p.country,
            name: p.alias,
            profileId: p.profile_id,

            // TODO fix
            faction: '',
            time: '',
            teamSlot: -1,
        }

        getExtraInfo(
            [newPlayer],

            (result) => {
                if (!newPlayer.profileId) {
                    return
                }

                const ex = result[newPlayer.profileId]
                if (result && ex) {
                    dispatch({
                        type: 'PLAYER_CARD_ON',
                        data: {
                            player: newPlayer,
                            extraInfo: ex,
                        },
                    })
                }
            }
        )
    }

    return (
        <div
            className={styles.membersDiv}
            key={props.member.name}
            onClick={() => handlePlayerCardOn(props.member)}
        >
            <img
                className={styles.flagImage}
                src={countryFlags[props.member.country]}
                alt={`${props.member.country}`}
            />

            {props.member.alias}
        </div>
    )
}
