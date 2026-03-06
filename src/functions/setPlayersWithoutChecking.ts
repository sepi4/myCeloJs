import { writeRankings } from './writeRankings'
// import { DataFromFile, Store } from '../types';
import { Player, Store } from '../types'
import { useExtraInfoStore } from '../stores/extraInfoStore'
import { useFromFileStore } from '../stores/fromFileStore'
import { useNavButtonsStore } from '../stores/navButtonsStore'
import { useOpenInfosStore } from '../stores/openInfosStore'
import { usePlayerCardStore } from '../stores/playerCardStore'
import { usePlayersStore } from '../stores/playersStore'
import { useViewStore } from '../stores/viewStore'

export default function setPlayersWithoutChecking(
    data: Player[],
    state: Store
) {
    useFromFileStore.getState().setFromFile(data)
    useOpenInfosStore.getState().resetOpenInfos()
    usePlayerCardStore.getState().resetPlayerCard()
    usePlayersStore.getState().setPlayers(data)
    useViewStore.getState().setView('main')
    const { navButtons: { coh3 } } = useNavButtonsStore.getState()
    useExtraInfoStore.getState().clearExtraInfo()
    if (state.settings) {
        writeRankings(coh3, data, state.settings.rankingsHorizontal)
    }
}
