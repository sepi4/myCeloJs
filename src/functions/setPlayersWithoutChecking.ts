import { writeRankings } from './writeRankings'
// import { DataFromFile, Store } from '../types';
import { PlayerFromFile, Store } from '../types'

export default function setPlayersWithoutChecking(
    data: PlayerFromFile[],
    state: Store,
    dispatch: ({ type, data }: { type: string; data: PlayerFromFile[] }) => void
) {
    // console.log('data:', data);

    dispatch({
        type: 'SET_NEW_PLAYERS',
        data,
    })
    if (state.settings) {
        writeRankings(data, state.settings.rankingsHorizontal)
    }
}
