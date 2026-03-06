import { writeRankings } from './writeRankings'
import { Player, Store } from '../types'
import { useExtraInfoStore } from '../stores/extraInfoStore'
import { useFromFileStore } from '../stores/fromFileStore'
import { useNavButtonsStore } from '../stores/navButtonsStore'
import { useOpenInfosStore } from '../stores/openInfosStore'
import { usePlayerCardStore } from '../stores/playerCardStore'
import { usePlayersStore } from '../stores/playersStore'

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
    const { fromFile, setFromFile } = useFromFileStore.getState()
    const { navButtons: { coh3 } } = useNavButtonsStore.getState()
    if (JSON.stringify(fromFile) !== JSON.stringify(data)) {
        setFromFile(data)
        useExtraInfoStore.getState().clearExtraInfo()
        useOpenInfosStore.getState().resetOpenInfos()
        usePlayerCardStore.getState().resetPlayerCard()
        usePlayersStore.getState().setPlayers(data)
        dispatch({
            type: 'SET_NEW_PLAYERS',
            data,
        })
        if (state.settings) {
            writeRankings(coh3, data, state.settings.rankingsHorizontal)
            if (playAudio && data.length > 0) {
                playAudio()
            }
        }
    }
}
