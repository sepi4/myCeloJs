import { writeRankings } from './writeRankings';
import { DataFromFile, Store } from '../types';

export default function setPlayersWithoutChecking(
    data: DataFromFile[],
    state: Store,
    dispatch: ({ type, data }: { type: string; data: DataFromFile[] }) => void
) {
    // console.log('data:', data);

    dispatch({
        type: 'SET_NEW_PLAYERS',
        data,
    });
    if (state.settings) {
        writeRankings(
            data,
            state.settings.rankingsHtml,
            state.settings.rankingsHorizontal,
            'setPlayersWithoutChecking'
        );
    }
}
