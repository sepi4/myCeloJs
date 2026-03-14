/* eslint-disable @typescript-eslint/ban-ts-comment */
import logo_coh2 from '../../assets/img/logo_coh2.png'
import logo_cohstats from '../../assets/img/logo_cohstats.png'
import logo_steam from '../../assets/img/logo_steam.png'
import { COH2_ORG, COH2STATS_COM, COH3STATS_COM, STEAM } from '../../constants'
import { useCountryFlagsStore } from '../../stores/countryFlagsStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import PlayerExtraInfo from '../Player/PlayerExtraInfo'
import styles from './PlayerCard.module.css'

export default function PlayerCard() {
    const { countryFlags } = useCountryFlagsStore()
    const {
        navButtons: { coh3 },
    } = useNavButtonsStore()
    const { player, extraInfo } = usePlayerCardStore()

    if (!player) {
        return null
    }

    if (!extraInfo) {
        return (
            <>
                <div className={styles.nameDiv}>
                    <img
                        src={countryFlags[player.country ?? '']}
                        alt={`${player.country}`}
                        title={`${player.country}`}
                    />
                    <span>{player.name}</span>
                </div>
            </>
        )
    }

    const name = (
        <div className={styles.nameDiv}>
            <img
                src={countryFlags[player.country ?? '']}
                alt={`${player.country}`}
                title={`${player.country}`}
            />
            <span>{player.name}</span>
        </div>
    )

    const steamId = extraInfo.steamId

    const table = (
        <div className={styles.info}>
            <table>
                <tbody>
                    <tr>
                        <th>steam id:</th>
                        <td data-testid="steam-id-value">{steamId}</td>
                    </tr>
                    <tr>
                        <th>profile id:</th>
                        <td>{player.profileId}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )

    const linkSteam = STEAM + steamId
    const funSteam = () => (steamId ? window.electronAPI.shell.openExternal(linkSteam) : null)

    const linkImages = coh3 ? (
        <div className={styles.links}>
            <img
                data-testid="link-coh3stats"
                data-url={COH3STATS_COM + player.profileId}
                src={logo_cohstats}
                alt="coh3stats"
                title="coh3stats.com"
                onClick={() =>
                    player.profileId
                        ? window.electronAPI.shell.openExternal(COH3STATS_COM + player.profileId)
                        : null
                }
            />
            <img
                data-testid="link-steam"
                data-url={linkSteam}
                src={logo_steam}
                alt="steam"
                title="steam"
                onClick={funSteam}
            />
        </div>
    ) : (
        <div className={styles.links}>
            <img
                data-testid="link-coh2stats"
                data-url={COH2STATS_COM + steamId}
                src={logo_cohstats}
                alt="coh2stats"
                title="coh2stats.com"
                onClick={() =>
                    steamId ? window.electronAPI.shell.openExternal(COH2STATS_COM + steamId) : null
                }
            />
            <img
                data-testid="link-coh2"
                data-url={COH2_ORG + steamId}
                src={logo_coh2}
                alt="coh2"
                title="coh2.org"
                onClick={() =>
                    steamId ? window.electronAPI.shell.openExternal(COH2_ORG + steamId) : null
                }
            />
            <img
                data-testid="link-steam"
                data-url={linkSteam}
                src={logo_steam}
                alt="steam"
                title="steam"
                onClick={funSteam}
            />
        </div>
    )

    const card = extraInfo && (
        // @ts-ignore player is a partial Player used only for display
        <PlayerExtraInfo player={player} extraInfo={extraInfo} />
    )

    return (
        <>
            {name}
            {table}
            {linkImages}
            {card}
        </>
    )
}
