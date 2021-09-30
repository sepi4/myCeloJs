import { writeRankings } from './writeRankings';
import { PlayerFromFile, Store } from '../types';

interface Props {
    data: PlayerFromFile[];
    state: Store;
    dispatch: ({
        type,
        data,
    }: {
        type: string;
        data: PlayerFromFile[];
    }) => void;
    playAudio?: () => void;
}

export default function checkLogData({
    data,
    state,
    dispatch,
    playAudio,
}: Props) {
    if (JSON.stringify(state.fromFile) !== JSON.stringify(data)) {
        dispatch({
            type: 'SET_NEW_PLAYERS',
            data,
        });
        if (state.settings) {
            writeRankings(
                data,
                state.settings.rankingsHorizontal,
                'checkLogData'
            );
            if (playAudio && data.length > 0) {
                playAudio();
            }
        }
    }
}
