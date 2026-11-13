import { Ref } from 'react'

import { countryFlags } from '../../constants/countryFlags'
import useLanguage from '../../hooks/useLanguage'
import useNavbarPosition from '../../hooks/useNavbarPosition'
import { PlayerCardData } from '../../stores/playerCardStore'
import { getCountryName } from '../../translations/countryTranslations'
import PlayerName from '../PlayerName'

import styles from './PlayerCard.module.css'

interface Props {
    player: PlayerCardData
    avatarUrl: string | null | undefined
    ref: Ref<HTMLDivElement>
    visible: boolean
}

export default function PlayerCardStickyName({ player, avatarUrl, ref, visible }: Props) {
    const language = useLanguage()
    const isTopNavbar = useNavbarPosition() === 'top'

    return (
        <div
            ref={ref}
            className={`${styles.stickyAnchor} ${isTopNavbar ? styles.stickyBelowTopNavbar : ''}`}
        >
            <div
                data-testid="player-card-sticky-name"
                className={styles.stickyBar}
                hidden={!visible}
            >
                {/* the avatar sits outside the flow so the flag and name line up with the card's own name */}
                <span className={styles.stickyFlag}>
                    {avatarUrl && (
                        <img
                            data-testid="sticky-steam-avatar"
                            className={styles.stickyAvatar}
                            src={avatarUrl}
                            alt="steam avatar"
                        />
                    )}
                    <img
                        src={countryFlags[player.country ?? '']}
                        alt={`${player.country}`}
                        title={getCountryName(player.country, language)}
                    />
                </span>
                <span className={styles.name}>
                    <PlayerName name={player.name} />
                </span>
            </div>
        </div>
    )
}
