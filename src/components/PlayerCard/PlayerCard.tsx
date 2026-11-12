import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import logo_coh2 from '../../assets/img/logo_coh2.png'
import logo_cohstats from '../../assets/img/logo_cohstats.png'
import logo_steam from '../../assets/img/logo_steam.png'
import { countryFlags } from '../../constants/countryFlags'
import { GAMES, otherGame } from '../../constants/games'
import { COH2_ORG, COH2STATS_COM, COH3STATS_COM, STEAM } from '../../constants/urls'
import { fetchProfileIdBySteamId } from '../../functions/api/fetchProfileIdBySteamId'
import { fetchPlayerExtraInfo } from '../../functions/api/getExtraInfo'
import { PlayerCardContext } from '../../hooks/useDisplayGame'
import useLanguage from '../../hooks/useLanguage'
import useNavbarPosition from '../../hooks/useNavbarPosition'
import useSteamAvatar from '../../hooks/useSteamAvatar'
import useText from '../../hooks/useText'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { getCountryName } from '../../translations/countryTranslations'
import Choice from '../Choice'
import PlayerExtraInfo from '../Player/PlayerExtraInfo'
import PlayerName from '../PlayerName'

import styles from './PlayerCard.module.css'

export default function PlayerCard() {
    const getText = useText()
    const language = useLanguage()
    const isTopNavbar = useNavbarPosition() === 'top'
    const {
        player,
        extraInfo,
        initialGame,
        selectedGame,
        otherGameLoading,
        otherGameChecked,
        otherPlayer,
        setOtherGameData,
        setOtherGameLoading,
        setSelectedGame,
        gameHistory,
        updateGameHistory,
        navigation,
    } = usePlayerCardStore()

    // Each newly shown card starts where it was left, or at the top if it is new.
    // Runs only when the card changes, not when the coh2/coh3 view is switched.
    useLayoutEffect(() => {
        window.scrollTo(0, usePlayerCardStore.getState().scrollY)
        // oxlint-disable-next-line react/exhaustive-effect-dependencies
    }, [navigation])

    const avatarUrl = useSteamAvatar(extraInfo?.steamId)

    const nameRef = useRef<HTMLDivElement>(null)
    const stickyRef = useRef<HTMLDivElement>(null)
    const [nameScrolledAway, setNameScrolledAway] = useState(false)

    useEffect(() => {
        function check() {
            const nameEl = nameRef.current
            const stickyEl = stickyRef.current
            if (!nameEl || !stickyEl) {
                return
            }
            // The sticky anchor stops right under the navbar, so its top tells where the navbar ends.
            const covered =
                nameEl.getBoundingClientRect().bottom <= stickyEl.getBoundingClientRect().top
            setNameScrolledAway(covered)
        }
        check()
        window.addEventListener('scroll', check, { passive: true })
        window.addEventListener('resize', check)
        return () => {
            window.removeEventListener('scroll', check)
            window.removeEventListener('resize', check)
        }
    }, [])

    const steamIdForLookup = selectedGame === initialGame ? extraInfo?.steamId : null

    useEffect(() => {
        // A card restored from the navigation history already knows its other-game profile.
        if (!steamIdForLookup || otherGameChecked) {
            return
        }
        const lookupGame = otherGame(initialGame)

        let cancelled = false
        setOtherGameLoading(true)

        async function lookup() {
            const profileId = await fetchProfileIdBySteamId(lookupGame, steamIdForLookup as string)
            if (cancelled) {
                return
            }
            if (!profileId) {
                setOtherGameData(null, null)
                return
            }
            const otherExtraInfo = await fetchPlayerExtraInfo(lookupGame, profileId)
            if (cancelled) {
                return
            }
            if (!otherExtraInfo || otherExtraInfo.ranks.length === 0) {
                setOtherGameData(null, null)
                return
            }
            const otherAlias = otherExtraInfo.ranks[0]?.members?.find(
                (m) => m.profile_id === profileId
            )?.alias
            setOtherGameData(
                {
                    country: player?.country,
                    name: otherAlias ?? player?.name,
                    profileId,
                },
                otherExtraInfo
            )
        }
        lookup()

        return () => {
            cancelled = true
        }
    }, [
        steamIdForLookup,
        initialGame,
        player,
        otherGameChecked,
        setOtherGameData,
        setOtherGameLoading,
    ])

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
                        title={getCountryName(player.country, language)}
                    />
                    <span className={styles.name}>
                        <PlayerName name={player.name} />
                    </span>
                </div>
            </>
        )
    }

    const avatar = (
        <div className={styles.avatarRow}>
            <div className={styles.avatar}>
                {avatarUrl && (
                    <img
                        data-testid="steam-avatar"
                        src={avatarUrl}
                        alt="steam avatar"
                        onError={() => console.log('steam avatar image failed to load:', avatarUrl)}
                    />
                )}
            </div>
        </div>
    )

    const flagAndName = (
        <>
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
        </>
    )

    const stickyBar = (
        <div
            ref={stickyRef}
            className={`${styles.stickyAnchor} ${isTopNavbar ? styles.stickyBelowTopNavbar : ''}`}
        >
            <div
                data-testid="player-card-sticky-name"
                className={styles.stickyBar}
                hidden={!nameScrolledAway}
            >
                {flagAndName}
            </div>
        </div>
    )

    const name = (
        <div ref={nameRef} className={styles.nameDiv}>
            <img
                src={countryFlags[player.country ?? '']}
                alt={`${player.country}`}
                title={getCountryName(player.country, language)}
            />
            <span data-testid="player-card-name" className={styles.name}>
                <PlayerName name={player.name} />
            </span>
        </div>
    )

    const steamId = extraInfo.steamId

    const otherAvailable = otherGameChecked && otherPlayer !== null
    const noProfileTitle =
        otherGameChecked && !otherPlayer ? getText('no_profile_for_game') : undefined

    const gameRadio = (
        <div className={styles.gameRadio}>
            {GAMES.map((game) => {
                const selected = game === selectedGame
                return (
                    <Choice
                        key={game}
                        type="radio"
                        testId={`player-card-radio-${game}`}
                        name="player-card-game"
                        label={game}
                        checked={selected}
                        disabled={!selected && (otherGameLoading || !otherAvailable)}
                        onChange={() => setSelectedGame(game)}
                        title={selected ? undefined : noProfileTitle}
                    />
                )
            })}
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

    const linkImages =
        selectedGame === 'coh3' ? (
            <div className={styles.links}>
                <img
                    data-testid="link-coh3stats"
                    data-url={COH3STATS_COM + player.profileId}
                    src={logo_cohstats}
                    alt="coh3stats"
                    title="coh3stats.com"
                    onClick={() =>
                        player.profileId
                            ? window.electronAPI.shell.openExternal(
                                  COH3STATS_COM + player.profileId
                              )
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
                        steamId
                            ? window.electronAPI.shell.openExternal(COH2STATS_COM + steamId)
                            : null
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
        <PlayerExtraInfo
            player={player}
            extraInfo={extraInfo}
            gameHistory={gameHistory}
            updateGameHistory={updateGameHistory}
        />
    )

    return (
        <PlayerCardContext.Provider value={true}>
            {stickyBar}
            {avatar}
            {name}
            {table}
            {gameRadio}
            {linkImages}
            {card}
        </PlayerCardContext.Provider>
    )
}
