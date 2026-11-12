import { MouseEvent, useEffect, useRef, useState } from 'react'

import { GAME_CONFIG, getFactionCode, getFactionFlag } from '../../constants/games'
import { getTotalGames } from '../../functions/rankings/simpleFunctions'
import useText from '../../hooks/useText'
import { useCountryFlagsStore } from '../../stores/countryFlagsStore'
import { useGameStore } from '../../stores/gameStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { useSettingsStore } from '../../stores/settingsStore'
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
    const { settings } = useSettingsStore()
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

    const { countryFlags } = useCountryFlagsStore()
    const countryFlagLocation = countryFlags[country ? country : '']

    const dropDownArrow = (
        <span style={{ width: '2em' }}>
            {Number(player.profileId) > 0 && (
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
    const rankValue = player.ranking == null || player.ranking === -1 ? '-' : player.ranking
    const rank = `${rankValue}${teamMarker}`

    const ranktotal =
        player.ranking && player.ranking > 0
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
                title={getCountryName(country, settings?.language)}
            />
        ) : null

    const isRealPlayer = Number(player.profileId) > 0
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

    const isTopNavbar = settings?.navbarPosition !== 'left' && settings?.navbarPosition !== 'right'
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
