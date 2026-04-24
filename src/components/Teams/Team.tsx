import { faAngleDoubleDown, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import getText from '../../functions/utils/getText'
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
    const { openInfos, setTeamOpenInfos } = useOpenInfosStore()
    const { settings } = useSettingsStore()

    const teamOpenInfos = openInfos[props.teamIndex]
    const anyOpen = teamOpenInfos.some((v) => v)

    const handleToggleAll = () => {
        setTeamOpenInfos(props.teamIndex, !anyOpen)
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
            >
                <FontAwesomeIcon
                    icon={anyOpen ? faAngleDoubleDown : faAngleDoubleRight}
                    size="sm"
                />
            </button>
            {props.players.map((p, i) => (
                <Player
                    key={p.profileId && p.profileId > 0 ? p.profileId : `${props.teamIndex}-${i}`}
                    player={p}
                    extraInfo={extraInfo && p.profileId ? extraInfo[p.profileId] : null}
                    playerIndex={i}
                    teamIndex={props.teamIndex}
                />
            ))}
        </div>
    )
}

export default Team
