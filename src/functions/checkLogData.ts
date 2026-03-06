import { writeRankings } from './writeRankings'
import { Player, Store } from '../types'
import { useExtraInfoStore } from '../stores/extraInfoStore'

interface Props {
    data: Player[]
    state: Store
    dispatch: ({ type, data }: { type: string; data: Player[] }) => void
    playAudio?: () => void
}

export default function checkLogData({
    data,
    state,
    dispatch,
    playAudio,
}: Props) {
    if (JSON.stringify(state.fromFile) !== JSON.stringify(data)) {
        useExtraInfoStore.getState().clearExtraInfo()
        dispatch({
            type: 'SET_NEW_PLAYERS',
            data,
        })
        if (state.settings) {
            writeRankings(state.navButtons.coh3, data, state.settings.rankingsHorizontal)
            if (playAudio && data.length > 0) {
                playAudio()
            }
        }
    }
}
