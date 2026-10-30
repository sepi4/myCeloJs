import getText from '../../functions/utils/getText'
import { getTime, getTimeRange } from '../../functions/utils/time'
import {
    MatchHistoryReportResult,
    MatchObject,
    NormalizedProfiles,
    SettingsType,
} from '../../types'
import MatchTableBody from './MatchTableBody'
import MatchTableHeaders from './MatchTableHeaders'

import styles from './GameDetails.module.css'

interface Props {
    game: MatchObject
    players: MatchHistoryReportResult[]
    profiles: NormalizedProfiles
    settings: SettingsType
}

function GameDetails(props: Props) {
    const { settings, game, players, profiles } = props

    const lg = settings && settings.language ? settings.language : 'en'

    const timeRange = getTimeRange(game.startGameTime, game.endGameTime, lg)
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
                <dt data-testid="game-time">{getText('time', settings)}</dt>
                <dd>{timeRange}</dd>
                <dt>{getText('duration', settings)}</dt>
                <dd>{durationTime}</dd>
            </dl>
        </div>
    )
}
export default GameDetails
