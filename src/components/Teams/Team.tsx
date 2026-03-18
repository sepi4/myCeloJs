import { faAngleDoubleDown, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import getText from '../../functions/getText'
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

    return (
        <div data-testid="team-container" className={css.container}>
            <span
                onClick={handleToggleAll}
                className={css.toggleAll}
                title={
                    anyOpen
                        ? getText('collapse_all_team', settings)
                        : getText('expand_all_team', settings)
                }
            >
                <FontAwesomeIcon
                    icon={anyOpen ? faAngleDoubleDown : faAngleDoubleRight}
                    size="sm"
                />
            </span>
            {props.players.map((p, i) => (
                <Player
                    key={p.profileId ? p.profileId : i}
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
