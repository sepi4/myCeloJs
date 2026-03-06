import styles from './Members.module.css'

import { getExtraInfo } from '../../functions/getExtraInfo'
import { useAppDispatch } from '../../hooks/customReduxHooks'
import { useCountryFlagsStore } from '../../stores/countryFlagsStore'
import { Member as MemberType } from '../../types'
import { useNavButtonsStore } from '../../stores/navButtonsStore'

interface Props {
    member: MemberType
}

export default function Member(props: Props) {
    const { countryFlags } = useCountryFlagsStore()
    const dispatch = useAppDispatch()
    const { navButtons: { coh3 } } = useNavButtonsStore()

    const handlePlayerCardOn = (p: MemberType) => {
        const newPlayer = {
            country: p.country,
            name: p.alias,
            profileId: p.profile_id,
        }

        getExtraInfo(
            coh3,
            [p.profile_id],
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
