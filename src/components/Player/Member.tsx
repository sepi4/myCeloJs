import useOpenPlayerCard from '../../hooks/useOpenPlayerCard'
import { useCountryFlagsStore } from '../../stores/countryFlagsStore'
import { Member as MemberType } from '../../types'
import PlayerName from '../PlayerName'

import styles from './Members.module.css'

interface Props {
    member: MemberType
}

export default function Member(props: Props) {
    const { countryFlags } = useCountryFlagsStore()
    const openPlayerCard = useOpenPlayerCard()

    const handlePlayerCardOn = (p: MemberType) =>
        openPlayerCard({ country: p.country, name: p.alias, profileId: p.profile_id })

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
