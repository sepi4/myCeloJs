import { writeRankings } from './writeRankings'

export default function checkLogData(data, state, dispatch, playAudio) {

    if (JSON.stringify(state.fromFile) !== JSON.stringify(data)) {
        dispatch({
            type: 'SET_NEW_PLAYERS',
            data,
        })
        if (state.settings) {
            writeRankings(
                data,
                state.settings.rankingsHtml,
                state.settings.rankingsHorizontal,
                'checkLogData'
            )
            if (playAudio && data.length > 0) {
                playAudio()
            }
        }
    }
}