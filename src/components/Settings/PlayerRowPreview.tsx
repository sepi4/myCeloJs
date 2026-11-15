import { samplePlayers } from '../../functions/rankings/samplePlayers'
import useText from '../../hooks/useText'
import { useGameStore } from '../../stores/gameStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { Player } from '../../types'
import PlayerRow from '../Player/PlayerRow'

import styles from './PlayerRowPreview.module.css'

export default function PlayerRowPreview() {
    const getText = useText()
    const { game } = useGameStore()
    const { settings } = useSettingsStore()

    // Without a profile ID the row cannot be clicked open.
    const samplePlayer: Player = { ...samplePlayers(game)[0]!, profileId: undefined }

    return (
        <div className={styles.preview} data-testid="player-row-preview">
            <div className={styles.title}>{getText('preview')}</div>
            <div className={styles.frame}>
                <PlayerRow
                    player={samplePlayer}
                    playerRanks={{ ranks: [], steamId: settings?.steamId }}
                    showDetails={false}
                    toggleDetails={() => {}}
                />
            </div>
        </div>
    )
}
