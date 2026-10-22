import getText from '../../functions/utils/getText'
import { getDateTime, getTime } from '../../functions/utils/time'
import {
    MatchHistoryReportResult,
    MatchObject,
    NormalizedProfiles,
    SettingsType,
} from '../../types'
import styles from './GameDetails.module.css'
import MatchTableBody from './MatchTableBody'
import MatchTableHeaders from './MatchTableHeaders'

interface Props {
    game: MatchObject
    players: MatchHistoryReportResult[]
    profiles: NormalizedProfiles
    settings: SettingsType
}

function GameDetails(props: Props) {
    const { settings, game, players, profiles } = props

    const lg = settings && settings.language ? settings.language : 'en'

    const startTime = getDateTime(game.startGameTime, lg)
    const endTime = getDateTime(game.endGameTime, lg)
    const durationTime = getTime(game.endGameTime.getTime() - game.startGameTime.getTime())

    return (
        <div data-testid="game-details" className={styles.content}>
            <table className={styles.table}>
                <MatchTableHeaders settings={settings} players={players} profiles={profiles} />
                <MatchTableBody game={game} settings={settings} players={players} />
            </table>
            <dl className={styles.meta}>
                <dt>{getText('map', settings)}</dt>
                <dd>{game.mapName}</dd>
                <dt>{getText('duration', settings)}</dt>
                <dd>{durationTime}</dd>
                <dt data-testid="game-start">{getText('game_start_time', settings)}</dt>
                <dd>{startTime}</dd>
                <dt data-testid="game-end">{getText('game_end_time', settings)}</dt>
                <dd>{endTime}</dd>
            </dl>
        </div>
    )
}
export default GameDetails
