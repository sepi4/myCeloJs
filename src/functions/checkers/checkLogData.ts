import { GAME_CONFIG } from '../../constants/games'
import { useExtraInfoStore } from '../../stores/extraInfoStore'
import { useFromFileStore } from '../../stores/fromFileStore'
import { useGameStore } from '../../stores/gameStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { useOpenInfosStore } from '../../stores/openInfosStore'
import { usePlayersStore } from '../../stores/playersStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { Player } from '../../types'
import { writeRankings } from '../rankings/writeRankings'

interface Props {
    data: Player[]
    playAudio?: () => void
}

export default function checkLogData({ data, playAudio }: Props) {
    const { fromFile, setFromFile } = useFromFileStore.getState()
    const { game } = useGameStore.getState()
    const {
        navButtons: { elo },
    } = useNavButtonsStore.getState()
    const { settings } = useSettingsStore.getState()
    if (JSON.stringify(fromFile) !== JSON.stringify(data)) {
        setFromFile(data)
        useExtraInfoStore.getState().clearExtraInfo()
        useOpenInfosStore.getState().resetOpenInfos()
        usePlayersStore.getState().setPlayers(data)
        useNavigationStore.getState().resetNavigation()
        if (settings) {
            writeRankings(game, data, settings.rankingsHorizontal, GAME_CONFIG[game].hasElo && elo)
            if (playAudio && data.length > 0) {
                playAudio()
            }
        }
    }
}
