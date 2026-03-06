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

export default function setPlayersWithoutChecking(data: Player[]) {
    useFromFileStore.getState().setFromFile(data)
    useOpenInfosStore.getState().resetOpenInfos()
    usePlayerCardStore.getState().resetPlayerCard()
    usePlayersStore.getState().setPlayers(data)
    useViewStore.getState().setView('main')
    const { navButtons: { coh3 } } = useNavButtonsStore.getState()
    const { settings } = useSettingsStore.getState()
    useExtraInfoStore.getState().clearExtraInfo()
    if (settings) {
        writeRankings(coh3, data, settings.rankingsHorizontal)
    }
}
