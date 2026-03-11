import { getExtraInfo } from '../../functions/getExtraInfo'
import { useCountryFlagsStore } from '../../stores/countryFlagsStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { useViewStore } from '../../stores/viewStore'
import { Member as MemberType } from '../../types'
import styles from './Members.module.css'

interface Props {
    member: MemberType
}

export default function Member(props: Props) {
    const { countryFlags } = useCountryFlagsStore()
    const {
        navButtons: { coh3 },
    } = useNavButtonsStore()
    const { setPlayerCard } = usePlayerCardStore()
    const { setView } = useViewStore()

    const handlePlayerCardOn = async (p: MemberType) => {
        const newPlayer = {
            country: p.country,
            name: p.alias,
            profileId: p.profile_id,
        }
        const x = await getExtraInfo(coh3, [p.profile_id])
        if (!x) {
            return
        }
        if (!newPlayer.profileId) {
            return
        }
        const ex = x.result[newPlayer.profileId]
        if (ex) {
            setPlayerCard(newPlayer, ex)
            setView('playerCard')
        }
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
