/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef } from 'react'

import logo_coh2 from '../../assets/img/logo_coh2.png'
import logo_cohstats from '../../assets/img/logo_cohstats.png'
import logo_steam from '../../assets/img/logo_steam.png'
import { COH2_ORG, COH2STATS_COM, COH3STATS_COM, STEAM } from '../../constants/urls'
import { fetchProfileIdBySteamId } from '../../functions/api/fetchProfileIdBySteamId'
import { getExtraInfo } from '../../functions/api/getExtraInfo'
import getText from '../../functions/utils/getText'
import { useCountryFlagsStore } from '../../stores/countryFlagsStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { useSettingsStore } from '../../stores/settingsStore'
import PlayerExtraInfo from '../Player/PlayerExtraInfo'
import styles from './PlayerCard.module.css'

export default function PlayerCard() {
    const { countryFlags } = useCountryFlagsStore()
    const { settings } = useSettingsStore()
    const {
        player,
        extraInfo,
        initialCoh3,
        selectedCoh3,
        otherGameLoading,
        otherGameChecked,
        otherPlayer,
        setOtherGameData,
        setOtherGameLoading,
        setSelectedCoh3,
    } = usePlayerCardStore()

    const lookupKeyRef = useRef<string | null>(null)

    const steamIdForLookup = selectedCoh3 === initialCoh3 ? extraInfo?.steamId : null

    useEffect(() => {
        if (!steamIdForLookup) {
            return
        }
        const otherCoh3 = !initialCoh3
        const key = `${steamIdForLookup}:${otherCoh3}`
        if (lookupKeyRef.current === key) {
            return
        }
        lookupKeyRef.current = key

        let cancelled = false
        setOtherGameLoading(true)

        async function lookup() {
            const profileId = await fetchProfileIdBySteamId(otherCoh3, steamIdForLookup as string)
            if (cancelled) {
                return
            }
            if (!profileId) {
                setOtherGameData(null, null)
                return
            }
            const x = await getExtraInfo(otherCoh3, [profileId])
            if (cancelled) {
                return
            }
            const ex = x?.result[profileId]
            if (!ex || ex.ranks.length === 0) {
                setOtherGameData(null, null)
                return
            }
            const otherAlias = ex.ranks[0].members?.find((m) => m.profile_id === profileId)?.alias
            setOtherGameData(
                {
                    country: player?.country,
                    name: otherAlias ?? player?.name,
                    profileId,
                },
                ex
            )
        }
        lookup()

        return () => {
            cancelled = true
        }
    }, [steamIdForLookup, initialCoh3, player, setOtherGameData, setOtherGameLoading])

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

    const otherAvailable = otherGameChecked && otherPlayer !== null
    const coh2Disabled = selectedCoh3 && (otherGameLoading || !otherAvailable)
    const coh3Disabled = !selectedCoh3 && (otherGameLoading || !otherAvailable)
    const noProfileTitle =
        otherGameChecked && !otherPlayer ? getText('no_profile_for_game', settings) : undefined
    const coh2Title = selectedCoh3 ? noProfileTitle : undefined
    const coh3Title = !selectedCoh3 ? noProfileTitle : undefined

    const gameRadio = (
        <div className={styles.gameRadio}>
            <label className={styles.radioOption} title={coh2Title}>
                <input
                    data-testid="player-card-radio-coh2"
                    type="radio"
                    name="player-card-game"
                    checked={!selectedCoh3}
                    disabled={coh2Disabled}
                    onChange={() => setSelectedCoh3(false)}
                />
                coh2
            </label>
            <label className={styles.radioOption} title={coh3Title}>
                <input
                    data-testid="player-card-radio-coh3"
                    type="radio"
                    name="player-card-game"
                    checked={selectedCoh3}
                    disabled={coh3Disabled}
                    onChange={() => setSelectedCoh3(true)}
                />
                coh3
            </label>
        </div>
    )

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

    const linkImages = selectedCoh3 ? (
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
            {gameRadio}
            {linkImages}
            {card}
        </>
    )
}
