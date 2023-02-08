/* eslint-disable @typescript-eslint/ban-ts-comment */
import PlayerExtraInfo from '../Player/PlayerExtraInfo'
import styles from './PlayerCard.module.css'

import logo_coh2 from '../../../img/logo_coh2.png'
import logo_coh2stats from '../../../img/logo_coh2stats.png'
import logo_steam from '../../../img/logo_steam.png'

import getSiteLink from '../../functions/getSiteLink'

import { shell } from 'electron'
import { useAppSelector } from '../../hooks/customReduxHooks'

export default function PlayerCard() {
    const state = useAppSelector((state) => state)
    const countryFlags = state.countryFlags

    const player = state.playerCard.player
    const extraInfo = state.playerCard.extraInfo

    if (!extraInfo) {
        return (
            <>
                <div className={styles.nameDiv}>
                    <img
                        src={countryFlags[player.country]}
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
                src={countryFlags[player.country]}
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
                        <td>{steamId}</td>
                    </tr>
                    <tr>
                        <th>profile id:</th>
                        <td>{player.profileId}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )

    const linkCoh2stats = getSiteLink('coh2stats.com') + steamId
    const funCoh2stats = () =>
        steamId ? shell.openExternal(linkCoh2stats) : null

    const linkCoh2 = getSiteLink('coh2.org') + steamId
    const funCoh2 = () => (steamId ? shell.openExternal(linkCoh2) : null)

    const linkSteam = getSiteLink('steam') + steamId
    const funSteam = () => (steamId ? shell.openExternal(linkSteam) : null)

    const linkImages = (
        <div className={styles.links}>
            <img
                src={logo_coh2stats}
                alt="coh2stats"
                title="coh2stats.com"
                onClick={funCoh2stats}
            />
            <img
                src={logo_coh2}
                alt="coh2"
                title="coh2.org"
                onClick={funCoh2}
            />
            <img
                src={logo_steam}
                alt="steam"
                title="steam"
                onClick={funSteam}
            />
        </div>
    )

    const card = state && state.playerCard && state.playerCard.extraInfo && (
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
