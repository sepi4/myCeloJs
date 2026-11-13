import { anyKeyOpen } from '../../functions/utils/openKeys'
import useText from '../../hooks/useText'
import { useOpenPlayerDetailsStore } from '../../stores/openPlayerDetailsStore'
import { usePlayerRanksStore } from '../../stores/playerRanksStore'
import { Player } from '../../types'
import { faAngleDoubleDown, faAngleDoubleRight } from '../icons'
import PlayerEntry from '../Player/PlayerEntry'
import SvgIcon from '../SvgIcon'

import css from './Team.module.css'

interface Props {
    players: Player[]
    teamIndex: number
}

function Team(props: Props) {
    const getText = useText()
    const { playerRanks } = usePlayerRanksStore()
    const { openPlayers, toggleOpenPlayers } = useOpenPlayerDetailsStore()

    // only players with their own open arrow, so the team button matches the arrows
    const toggleableIds = props.players.map((p) => p.profileId).filter((id) => id !== undefined)
    const anyOpen = anyKeyOpen(openPlayers, toggleableIds)

    const handleToggleAll = () => {
        toggleOpenPlayers(toggleableIds)
    }

    const teamClass = props.teamIndex === 0 ? css.teamA : css.teamB
    const showToggleAll = toggleableIds.length > 1
    const toggleTitle = anyOpen ? getText('collapse_all_team') : getText('expand_all_team')

    return (
        <div
            data-testid="team-container"
            className={`${css.container} ${teamClass} ${showToggleAll ? '' : css.noToggleAll}`}
        >
            {/* with one row the button would only repeat that row's own toggle */}
            {showToggleAll && (
                <button
                    data-testid="team-toggle"
                    onClick={handleToggleAll}
                    className={css.toggleAll}
                    title={toggleTitle}
                    aria-expanded={anyOpen}
                >
                    <SvgIcon icon={anyOpen ? faAngleDoubleDown : faAngleDoubleRight} size="sm" />
                </button>
            )}
            {props.players.map((p, i) => (
                <PlayerEntry
                    key={p.profileId ?? `${props.teamIndex}-${i}`}
                    player={p}
                    playerRanks={(p.profileId && playerRanks?.[p.profileId]) || null}
                />
            ))}
        </div>
    )
}

export default Team
