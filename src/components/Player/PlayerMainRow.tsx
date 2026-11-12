import { MouseEvent, useEffect, useRef, useState } from 'react'

import { countryFlags } from '../../constants/countryFlags'
import { GAME_CONFIG, getFactionCode, getFactionFlag } from '../../constants/games'
import { getTotalGames } from '../../functions/rankings/simpleFunctions'
import useLanguage from '../../hooks/useLanguage'
import useNavbarPosition from '../../hooks/useNavbarPosition'
import useText from '../../hooks/useText'
import { useGameStore } from '../../stores/gameStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { getCountryName } from '../../translations/countryTranslations'
import { ExtraInfo, Player } from '../../types'
import { faCaretDown, faCaretRight } from '../icons'
import PlayerName from '../PlayerName'
import SvgIcon from '../SvgIcon'
import MainRowSpan from './MainRowSpan'

import styles from './PlayerMainRow.module.css'

interface Props {
    player: Player
    extraInfo: ExtraInfo | null
    showExtra: boolean
    handleSetShowExtra: () => void
}

function PlayerMainRow(props: Props) {
    const getText = useText()
    const { game } = useGameStore()
    const {
        navButtons: { elo },
    } = useNavButtonsStore()
    const showElo = GAME_CONFIG[game].hasElo && elo
    const language = useLanguage()
    const isTopNavbar = useNavbarPosition() === 'top'
    const { player, handleSetShowExtra, extraInfo, showExtra } = props
    let country: string | undefined

    if (extraInfo && player.profileId) {
        for (const rank of extraInfo.ranks) {
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
        // the row itself toggles the extra info
        e.stopPropagation()
        openPlayerCard(player, extraInfo, game)
    }

    const countryFlagLocation = countryFlags[country ? country : '']

    const isRealPlayer = player.profileId !== undefined

    const dropDownArrow = (
        <span style={{ width: '2em' }}>
            {isRealPlayer && (
                <SvgIcon
                    data-testid="player-toggle"
                    aria-expanded={showExtra}
                    icon={showExtra ? faCaretDown : faCaretRight}
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
            ? (extraInfo?.ranks.find((r) => r.rank === player.ranking)?.ranktotal ?? 0)
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
                extraInfo && player.profileId
                    ? getTotalGames(extraInfo.ranks) + ' ' + getText('games_played')
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
        if (!showExtra) {
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
    }, [showExtra])

    const rowClass = [
        isRealPlayer && styles.toggleable,
        showExtra && styles.sticky,
        showExtra && isTopNavbar && styles.stickyBelowTopNavbar,
        showExtra && stuck && styles.stuck,
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
                onClick={isRealPlayer ? handleSetShowExtra : undefined}
            >
                <div className={styles.content}>
                    <MainRowSpan width="18%" justifyContent="flex-start">
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
                    </MainRowSpan>
                    {showElo && (
                        <MainRowSpan width="14%">
                            <span data-testid="player-elo" style={{ fontWeight: 300 }}>
                                {player.rating ? `(${player.rating})` : '-'}
                            </span>
                        </MainRowSpan>
                    )}
                    <MainRowSpan width="14%">{faction}</MainRowSpan>
                    <MainRowSpan width="14%">{countryFlag}</MainRowSpan>
                    <MainRowSpan width={showElo ? '40%' : '54%'}>{alias}</MainRowSpan>
                </div>
            </div>
        </>
    )
}

export default PlayerMainRow
