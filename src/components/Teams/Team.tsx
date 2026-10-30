import { faAngleDoubleDown, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import getText from '../../functions/utils/getText'
import { anyKeyOpen } from '../../functions/utils/openKeys'
import { useExtraInfoStore } from '../../stores/extraInfoStore'
import { useOpenInfosStore } from '../../stores/openInfosStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { Player as PlayerType } from '../../types'
import Player from '../Player/Player'

import css from './Team.module.css'

interface Props {
    players: PlayerType[]
    teamIndex: number
}

function Team(props: Props) {
    const { extraInfo } = useExtraInfoStore()
    const { openInfos, toggleOpenInfos } = useOpenInfosStore()
    const { settings } = useSettingsStore()

    // only players with their own open arrow, so the team button matches the arrows
    const toggleableIds = props.players
        .map((p) => p.profileId)
        .filter((id): id is number => id !== undefined && id > 0)
    const anyOpen = anyKeyOpen(openInfos, toggleableIds)

    const handleToggleAll = () => {
        toggleOpenInfos(toggleableIds)
    }

    const teamClass = props.teamIndex === 0 ? css.teamA : css.teamB
    const toggleTitle = anyOpen
        ? getText('collapse_all_team', settings)
        : getText('expand_all_team', settings)

    return (
        <div data-testid="team-container" className={css.container}>
            <button
                data-testid="team-toggle"
                onClick={handleToggleAll}
                className={`${css.toggleAll} ${css.toggleLeft} ${teamClass}`}
                title={toggleTitle}
                aria-expanded={anyOpen}
            >
                <FontAwesomeIcon
                    icon={anyOpen ? faAngleDoubleDown : faAngleDoubleRight}
                    size="sm"
                />
            </button>
            <button
                data-testid="team-toggle-right"
                onClick={handleToggleAll}
                className={`${css.toggleAll} ${css.toggleRight} ${teamClass}`}
                title={toggleTitle}
                aria-expanded={anyOpen}
            />
            {props.players.map((p, i) => (
                <Player
                    key={p.profileId && p.profileId > 0 ? p.profileId : `${props.teamIndex}-${i}`}
                    player={p}
                    extraInfo={extraInfo && p.profileId ? extraInfo[p.profileId] : null}
                />
            ))}
        </div>
    )
}

export default Team
