import Modal from 'react-modal'

import styles from './ModalDiv.module.css'

import getText from '../../functions/getText'

import ModalTableBody from './ModalTableBody'
import ModalTableHeaders from './ModalTableHeaders'
import { getDateTime, getTime } from '../../functions/time'
import {
    MatchHistoryReportResult,
    MatchObject,
    NormalizedProfiles,
    SettingsType,
} from '../../types'

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
    const durationTime = getTime(
        game.endGameTime.getTime() - game.startGameTime.getTime()
    )

    return (
        <Modal
            isOpen={modal}
            contentLabel="gameHistoryStats"
            ariaHideApp={false}
            shouldCloseOnOverlayClick={true}
            onRequestClose={() => setModal(false)}
            style={{
                content: {
                    top: '0',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    margin: '5em 2em 2em 2em',
                    borderRadius: '0',
                    backgroundColor: '#181818',
                    color: '#ddd',
                },
                overlay: {
                    backgroundColor: 'rgba(200, 200, 200, 0.5)',
                },
            }}
        >
            <div>
                <span className={styles.label}>
                    {getText('game_start_time', settings)}:
                </span>
                <span className={styles.value}>{startTime}</span>
            </div>
            <div>
                <span className={styles.label}>
                    {getText('game_end_time', settings)}:
                </span>
                <span className={styles.value}>{endTime}</span>
            </div>
            <div>
                <span className={styles.label}>
                    {getText('map', settings)}:
                </span>
                <span className={styles.value}>{game.mapName}</span>
            </div>
            <div>
                <span className={styles.label}>
                    {getText('duration', settings)}:
                </span>
                <span className={styles.value}>{durationTime}</span>
            </div>
            <table className={styles.table}>
                <ModalTableHeaders
                    settings={settings}
                    players={players}
                    profiles={profiles}
                />
                <ModalTableBody
                    game={game}
                    settings={settings}
                    players={players}
                />
            </table>
        </Modal>
    )
}
export default ModalDiv
