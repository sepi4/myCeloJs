import styles from './FoundPlayer.module.css'
import getText from '../../functions/getText'
import { getTimeAgo } from '../../functions/time'
import { useAppSelector } from '../../hooks/customReduxHooks'
import { CountryFlagsLocation, Member, SettingsType } from '../../types'

interface Props {
    player: Member
    clickFun: () => void
}

export default function FoundPlayer(props: Props) {
    const state = useAppSelector((state) => state)
    const countryFlags: CountryFlagsLocation = state.countryFlags
    const settings: SettingsType = state.settings

    const lg: string = settings?.language ? settings.language : 'en'

    const timeAgo = props.player?.lastGameTime
        ? getTimeAgo(new Date(props.player.lastGameTime * 1000), lg)
        : '-'

    // alias: "Sepi"
    // country: "de"
    // leaderboardregion_id: 0
    // level: 27
    // name: "/steam/76561198002332458"
    // personal_statgroup_id: 6874570
    // profile_id: 4578968
    // xp: 437372

    const name = (
        <div>
            <img
                className={styles.flagImage}
                src={countryFlags[props.player.country]}
                alt={`${props.player.country}`}
            />
            <span className={styles.alias}>{props.player.alias}</span>
        </div>
    )

    const table = (
        <table className={styles.table}>
            <tbody>
                <tr>
                    <th className={styles.label}>
                        {getText('mp_games', settings)}:
                    </th>
                    <td>{props.player.totalGames}</td>
                </tr>
                <tr>
                    <th className={styles.label}>
                        {getText('last_game', settings)}:
                    </th>
                    <td>{timeAgo}</td>
                </tr>
            </tbody>
        </table>
    )

    return (
        <div className={styles.container} onClick={props.clickFun}>
            {name}
            {table}
        </div>
    )
}
