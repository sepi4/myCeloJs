import { Ref } from 'react'

import { countryFlags } from '../../constants/countryFlags'
import useLanguage from '../../hooks/useLanguage'
import { PlayerCardData } from '../../stores/playerCardStore'
import { getCountryName } from '../../translations/countryTranslations'
import PlayerName from '../PlayerName'

import styles from './PlayerCard.module.css'

interface Props {
    player: PlayerCardData
    ref?: Ref<HTMLDivElement>
    testId?: string
}

export default function PlayerCardName({ player, ref, testId }: Props) {
    const language = useLanguage()

    return (
        <div ref={ref} className={styles.nameDiv}>
            <img
                src={countryFlags[player.country ?? '']}
                alt={`${player.country}`}
                title={getCountryName(player.country, language)}
            />
            <span data-testid={testId} className={styles.name}>
                <PlayerName name={player.name} />
            </span>
        </div>
    )
}
