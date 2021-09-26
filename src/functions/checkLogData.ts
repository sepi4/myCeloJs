import { writeRankings } from './writeRankings';
import { DataFromFile, Store } from '../types';

interface Props {
    data: DataFromFile[];
    state: Store;
    dispatch: ({ type, data }: { type: string; data: DataFromFile[] }) => void;
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
                state.settings.rankingsHtml,
                state.settings.rankingsHorizontal,
                'checkLogData'
            );
            if (playAudio && data.length > 0) {
                playAudio();
            }
        }
    }
}
