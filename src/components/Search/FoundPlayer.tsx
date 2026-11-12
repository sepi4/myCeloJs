import { countryFlags } from '../../constants/countryFlags'
import { getTimeAgo } from '../../functions/utils/time'
import useLanguage from '../../hooks/useLanguage'
import useSteamAvatar from '../../hooks/useSteamAvatar'
import useText from '../../hooks/useText'
import { getCountryName } from '../../translations/countryTranslations'
import { SearchResult } from '../../types'
import PlayerName from '../PlayerName'

import styles from './FoundPlayer.module.css'

interface Props {
    player: SearchResult
    onClick: () => void
}

export default function FoundPlayer(props: Props) {
    const getText = useText()
    const language = useLanguage()

    const timeAgo = props.player?.lastGameTime
        ? getTimeAgo(new Date(props.player.lastGameTime * 1000), language)
        : '-'

    const steamId = props.player.name.startsWith('/steam/') ? props.player.name.substring(7) : null
    const avatarUrl = useSteamAvatar(steamId)

    const name = (
        <div className={styles.name}>
            {/* the empty box keeps rows from shifting while avatars load */}
            <span className={styles.avatar}>
                {avatarUrl && (
                    <img data-testid="found-player-avatar" src={avatarUrl} alt="steam avatar" />
                )}
            </span>
            <img
                className={styles.flagImage}
                src={countryFlags[props.player.country]}
                alt={`${props.player.country}`}
                title={getCountryName(props.player.country, language)}
            />
            <span className={styles.alias}>
                <PlayerName name={props.player.alias} />
            </span>
        </div>
    )

    return (
        <div data-testid="found-player" className={styles.container} onClick={props.onClick}>
            {name}
            <span className={styles.stat}>
                <span className={styles.label}>{getText('mp_games')}:</span>
                {props.player.totalGames}
            </span>
            <span className={styles.stat}>
                <span className={styles.label}>{getText('last_game')}:</span>
                {timeAgo}
            </span>
        </div>
    )
}
