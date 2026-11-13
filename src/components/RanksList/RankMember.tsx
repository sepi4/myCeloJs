import { countryFlags } from '../../constants/countryFlags'
import useLanguage from '../../hooks/useLanguage'
import useOpenPlayerCard from '../../hooks/useOpenPlayerCard'
import { getCountryName } from '../../translations/countryTranslations'
import { Member } from '../../types'
import PlayerName from '../PlayerName'

import styles from './RankMembers.module.css'

interface Props {
    member: Member
}

export default function RankMember(props: Props) {
    const openPlayerCard = useOpenPlayerCard()
    const language = useLanguage()

    const handlePlayerCardOn = (p: Member) =>
        openPlayerCard({ country: p.country, name: p.alias, profileId: p.profile_id })

    return (
        <div
            className={styles.member}
            key={props.member.name}
            onClick={() => handlePlayerCardOn(props.member)}
        >
            <img
                className={styles.flagImage}
                src={countryFlags[props.member.country]}
                alt={`${props.member.country}`}
                title={getCountryName(props.member.country, language)}
            />

            <span className={styles.name}>
                <PlayerName name={props.member.alias} />
            </span>
        </div>
    )
}
