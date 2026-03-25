import getText from '../../functions/utils/getText'
import { getDateTime, getTime } from '../../functions/utils/time'
import {
    MatchHistoryReportResult,
    MatchObject,
    NormalizedProfiles,
    SettingsType,
} from '../../types'
import Modal from '../Modal/Modal'
import MatchTableBody from './MatchTableBody'
import MatchTableHeaders from './MatchTableHeaders'
import styles from './ModalDiv.module.css'

interface Props {
    game: MatchObject
    modal: boolean
    players: MatchHistoryReportResult[]
    profiles: NormalizedProfiles
    setModal: (x: boolean) => void
    settings: SettingsType
}

function ModalDiv(props: Props) {
    const { modal, setModal, settings, game, players, profiles } = props

    const lg = settings && settings.language ? settings.language : 'en'

    const startTime = getDateTime(game.startGameTime, lg)
    const endTime = getDateTime(game.endGameTime, lg)
    const durationTime = getTime(game.endGameTime.getTime() - game.startGameTime.getTime())

    return (
        <Modal
            isOpen={modal}
            onClose={() => setModal(false)}
            overlayClassName={styles.overlay}
            className={styles.content}
            data-testid="game-modal"
        >
            <div>
                <span data-testid="game-start" className={styles.label}>
                    {getText('game_start_time', settings)}:
                </span>
                <span className={styles.value}>{startTime}</span>
            </div>
            <div>
                <span data-testid="game-end" className={styles.label}>
                    {getText('game_end_time', settings)}:
                </span>
                <span className={styles.value}>{endTime}</span>
            </div>
            <div>
                <span className={styles.label}>{getText('map', settings)}:</span>
                <span className={styles.value}>{game.mapName}</span>
            </div>
            <div>
                <span className={styles.label}>{getText('duration', settings)}:</span>
                <span className={styles.value}>{durationTime}</span>
            </div>
            <table className={styles.table}>
                <MatchTableHeaders settings={settings} players={players} profiles={profiles} />
                <MatchTableBody game={game} settings={settings} players={players} />
            </table>
        </Modal>
    )
}
export default ModalDiv
