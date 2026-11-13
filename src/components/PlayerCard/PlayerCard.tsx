import { useLayoutEffect } from 'react'

import { PlayerCardContext } from '../../hooks/useDisplayGame'
import useNameScrolledAway from '../../hooks/useNameScrolledAway'
import useOtherGameLookup from '../../hooks/useOtherGameLookup'
import useSteamAvatar from '../../hooks/useSteamAvatar'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import PlayerDetails from '../Player/PlayerDetails'
import PlayerCardGameRadio from './PlayerCardGameRadio'
import PlayerCardLinks from './PlayerCardLinks'
import PlayerCardName from './PlayerCardName'
import PlayerCardStickyName from './PlayerCardStickyName'

import styles from './PlayerCard.module.css'

export default function PlayerCard() {
    const { player, playerRanks, selectedGame, gameHistory, updateGameHistory, navigation } =
        usePlayerCardStore()

    // Each newly shown card starts where it was left, or at the top if it is new.
    // Runs only when the card changes, not when the coh2/coh3 view is switched.
    useLayoutEffect(() => {
        window.scrollTo(0, usePlayerCardStore.getState().scrollY)
        // oxlint-disable-next-line react/exhaustive-effect-dependencies
    }, [navigation])

    const avatarUrl = useSteamAvatar(playerRanks?.steamId)
    const { nameRef, stickyRef, nameScrolledAway } = useNameScrolledAway()
    useOtherGameLookup()

    if (!player) {
        return null
    }

    if (!playerRanks) {
        return <PlayerCardName player={player} />
    }

    const steamId = playerRanks.steamId

    return (
        <PlayerCardContext.Provider value={true}>
            <PlayerCardStickyName
                player={player}
                avatarUrl={avatarUrl}
                ref={stickyRef}
                visible={nameScrolledAway}
            />
            <div className={styles.avatarRow}>
                <div className={styles.avatar}>
                    {avatarUrl && (
                        <img
                            data-testid="steam-avatar"
                            src={avatarUrl}
                            alt="steam avatar"
                            onError={() =>
                                console.log('steam avatar image failed to load:', avatarUrl)
                            }
                        />
                    )}
                </div>
            </div>
            <PlayerCardName player={player} ref={nameRef} testId="player-card-name" />
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
            <PlayerCardGameRadio />
            <PlayerCardLinks game={selectedGame} steamId={steamId} profileId={player.profileId} />
            <PlayerDetails
                player={player}
                playerRanks={playerRanks}
                gameHistory={gameHistory}
                updateGameHistory={updateGameHistory}
            />
        </PlayerCardContext.Provider>
    )
}
