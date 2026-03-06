import { writeRankings } from './writeRankings'
// import { DataFromFile, Store } from '../types';
import { Player, Store } from '../types'
import { useExtraInfoStore } from '../stores/extraInfoStore'

export default function setPlayersWithoutChecking(
    data: Player[],
    state: Store,
    dispatch: ({ type, data }: { type: string; data: Player[] }) => void
) {
    useExtraInfoStore.getState().clearExtraInfo()
    dispatch({
        type: 'SET_NEW_PLAYERS',
        data,
    })
    if (state.settings) {
        writeRankings(state.navButtons.coh3, data, state.settings.rankingsHorizontal)
    }
}
