import styles from './Members.module.css'

import { getExtraInfo } from '../../functions/getExtraInfo'
import { useCountryFlagsStore } from '../../stores/countryFlagsStore'
import { Member as MemberType } from '../../types'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { useViewStore } from '../../stores/viewStore'

interface Props {
    member: MemberType
}

export default function Member(props: Props) {
    const { countryFlags } = useCountryFlagsStore()
    const { navButtons: { coh3 } } = useNavButtonsStore()
    const { setPlayerCard } = usePlayerCardStore()
    const { setView } = useViewStore()

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
                    setPlayerCard(newPlayer, ex)
                    setView('playerCard')
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
