import { writeRankings } from './writeRankings'
import { Player } from '../types'
import { useExtraInfoStore } from '../stores/extraInfoStore'
import { useFromFileStore } from '../stores/fromFileStore'
import { useNavButtonsStore } from '../stores/navButtonsStore'
import { useOpenInfosStore } from '../stores/openInfosStore'
import { usePlayerCardStore } from '../stores/playerCardStore'
import { usePlayersStore } from '../stores/playersStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useViewStore } from '../stores/viewStore'

interface Props {
    data: Player[]
    playAudio?: () => void
}

export default function checkLogData({ data, playAudio }: Props) {
    const { fromFile, setFromFile } = useFromFileStore.getState()
    const { navButtons: { coh3 } } = useNavButtonsStore.getState()
    const { settings } = useSettingsStore.getState()
    if (JSON.stringify(fromFile) !== JSON.stringify(data)) {
        setFromFile(data)
        useExtraInfoStore.getState().clearExtraInfo()
        useOpenInfosStore.getState().resetOpenInfos()
        usePlayerCardStore.getState().resetPlayerCard()
        usePlayersStore.getState().setPlayers(data)
        useViewStore.getState().setView('main')
        if (settings) {
            writeRankings(coh3, data, settings.rankingsHorizontal)
            if (playAudio && data.length > 0) {
                playAudio()
            }
        }
    }
}
