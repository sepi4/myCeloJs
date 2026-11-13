import { MouseEvent, useEffect, useRef, useState } from 'react'

import { countryFlags } from '../../constants/countryFlags'
import { GAME_CONFIG, getFactionCode, getFactionFlag } from '../../constants/games'
import { getTotalGames } from '../../functions/rankings/totalGames'
import useLanguage from '../../hooks/useLanguage'
import useNavbarPosition from '../../hooks/useNavbarPosition'
import useText from '../../hooks/useText'
import { useDisplayOptionsStore } from '../../stores/displayOptionsStore'
import { useGameStore } from '../../stores/gameStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { getCountryName } from '../../translations/countryTranslations'
import { PlayerRanks, Player } from '../../types'
import { faCaretDown, faCaretRight } from '../icons'
import PlayerName from '../PlayerName'
import SvgIcon from '../SvgIcon'
import PlayerRowCell from './PlayerRowCell'

import styles from './PlayerRow.module.css'

interface Props {
    player: Player
    playerRanks: PlayerRanks | null
    showDetails: boolean
    toggleDetails: () => void
}

function PlayerRow(props: Props) {
    const getText = useText()
    const { game } = useGameStore()
    const {
        displayOptions: { showElo: elo },
    } = useDisplayOptionsStore()
    const showElo = GAME_CONFIG[game].hasElo && elo
    const language = useLanguage()
    const isTopNavbar = useNavbarPosition() === 'top'
    const { player, toggleDetails, playerRanks, showDetails } = props
    let country: string | undefined

    if (playerRanks && player.profileId) {
        for (const rank of playerRanks.ranks) {
            if (!rank.members) {
                continue
            }

            for (const member of rank.members) {
                if (member.profile_id === player.profileId) {
                    country = member.country
                    break
                }
            }
            if (country) {
                break
            }
        }
    }

    const openPlayerCard = useNavigationStore((s) => s.openPlayerCard)

    const handlePlayerCardOn = (e: MouseEvent) => {
        // the row itself toggles the details
        e.stopPropagation()
        openPlayerCard(player, playerRanks, game)
    }

    const countryFlagLocation = countryFlags[country ? country : '']

    const isRealPlayer = player.profileId !== undefined

    const dropDownArrow = (
        <span style={{ width: '2em' }}>
            {isRealPlayer && (
                <SvgIcon
                    data-testid="player-toggle"
                    aria-expanded={showDetails}
                    icon={showDetails ? faCaretDown : faCaretRight}
                    size="lg"
                    style={{ color: 'var(--text-primary)' }}
                />
            )}
        </span>
    )

    const teamMarker = player.teamMarker ? player.teamMarker : ''
    const rank = `${player.ranking ?? '-'}${teamMarker}`

    const ranktotal =
        player.ranking !== undefined
            ? (playerRanks?.ranks.find((r) => r.rank === player.ranking)?.ranktotal ?? 0)
            : 0
    const rankTitle = ranktotal > 0 ? `${player.ranking} ${getText('of')} ${ranktotal}` : ''

    const factionCode = getFactionCode(game, player.faction)
    const faction = (
        <span title={factionCode}>
            <img
                className={styles.factionFlag}
                src={getFactionFlag(game, factionCode)}
                alt={player.faction}
            />
        </span>
    )

    const countryFlag =
        country !== undefined ? (
            <img
                style={{
                    height: '1.2em',
                }}
                src={countryFlagLocation}
                alt={country}
                title={getCountryName(country, language)}
            />
        ) : null

    const alias = (
        <span
            data-testid="player-name"
            className={isRealPlayer ? styles.name : undefined}
            title={
                playerRanks && player.profileId
                    ? getTotalGames(playerRanks.ranks) + ' ' + getText('games_played')
                    : ''
            }
            onClick={isRealPlayer ? handlePlayerCardOn : undefined}
        >
            <PlayerName name={player.name} />
        </span>
    )

    const sentinelRef = useRef<HTMLDivElement>(null)
    const rowRef = useRef<HTMLDivElement>(null)
    const [stuck, setStuck] = useState(false)

    useEffect(() => {
        if (!showDetails) {
            setStuck(false)
            return
        }
        function check() {
            const sentinel = sentinelRef.current
            const row = rowRef.current
            if (!sentinel || !row) {
                return
            }
            // The sentinel stays where the row would be without sticking, so a gap means it is stuck.
            setStuck(sentinel.getBoundingClientRect().top < row.getBoundingClientRect().top - 1)
        }
        check()
        window.addEventListener('scroll', check, { passive: true })
        window.addEventListener('resize', check)
        return () => {
            window.removeEventListener('scroll', check)
            window.removeEventListener('resize', check)
        }
    }, [showDetails])

    const rowClass = [
        isRealPlayer && styles.toggleable,
        showDetails && styles.sticky,
        showDetails && isTopNavbar && styles.stickyBelowTopNavbar,
        showDetails && stuck && styles.stuck,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <>
            <div ref={sentinelRef} />
            <div
                ref={rowRef}
                data-testid="player-row"
                className={rowClass || undefined}
                onClick={isRealPlayer ? toggleDetails : undefined}
            >
                <div className={styles.content}>
                    <PlayerRowCell width="18%" justifyContent="flex-start">
                        <>
                            {dropDownArrow}{' '}
                            <span
                                data-testid="player-rank"
                                title={rankTitle}
                                style={{ fontWeight: 600 }}
                            >
                                {rank}
                            </span>
                        </>
                    </PlayerRowCell>
                    {showElo && (
                        <PlayerRowCell width="14%">
                            <span data-testid="player-elo" style={{ fontWeight: 300 }}>
                                {player.rating ? `(${player.rating})` : '-'}
                            </span>
                        </PlayerRowCell>
                    )}
                    <PlayerRowCell width="14%">{faction}</PlayerRowCell>
                    <PlayerRowCell width="14%">{countryFlag}</PlayerRowCell>
                    <PlayerRowCell width={showElo ? '40%' : '54%'}>{alias}</PlayerRowCell>
                </div>
            </div>
        </>
    )
}

export default PlayerRow
