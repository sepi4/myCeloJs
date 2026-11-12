import { getExtraInfo } from '../../functions/api/getExtraInfo'
import { useDisplayGame } from '../../hooks/useDisplayGame'
import { useCountryFlagsStore } from '../../stores/countryFlagsStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { Member as MemberType } from '../../types'
import PlayerName from '../PlayerName'

import styles from './Members.module.css'

interface Props {
    member: MemberType
}

export default function Member(props: Props) {
    const { countryFlags } = useCountryFlagsStore()
    const game = useDisplayGame()
    const openPlayerCard = useNavigationStore((s) => s.openPlayerCard)

    const handlePlayerCardOn = async (p: MemberType) => {
        const newPlayer = {
            country: p.country,
            name: p.alias,
            profileId: p.profile_id,
        }
        const x = await getExtraInfo(game, [p.profile_id])
        if (!x) {
            return
        }
        if (!newPlayer.profileId) {
            return
        }
        const ex = x.result[newPlayer.profileId]
        if (ex) {
            openPlayerCard(newPlayer, ex, game)
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

            <span className={styles.name}>
                <PlayerName name={props.member.alias} />
            </span>
        </div>
    )
}
