import { writeRankings } from './writeRankings'
// import { DataFromFile, Store } from '../types';
import { Player, Store } from '../types'
import { useExtraInfoStore } from '../stores/extraInfoStore'
import { useFromFileStore } from '../stores/fromFileStore'
import { useNavButtonsStore } from '../stores/navButtonsStore'
import { useOpenInfosStore } from '../stores/openInfosStore'
import { usePlayerCardStore } from '../stores/playerCardStore'
import { usePlayersStore } from '../stores/playersStore'

export default function setPlayersWithoutChecking(
    data: Player[],
    state: Store,
    dispatch: ({ type, data }: { type: string; data: Player[] }) => void
) {
    useFromFileStore.getState().setFromFile(data)
    useOpenInfosStore.getState().resetOpenInfos()
    usePlayerCardStore.getState().resetPlayerCard()
    usePlayersStore.getState().setPlayers(data)
    const { navButtons: { coh3 } } = useNavButtonsStore.getState()
    useExtraInfoStore.getState().clearExtraInfo()
    dispatch({
        type: 'SET_NEW_PLAYERS',
        data,
    })
    if (state.settings) {
        writeRankings(coh3, data, state.settings.rankingsHorizontal)
    }
}
