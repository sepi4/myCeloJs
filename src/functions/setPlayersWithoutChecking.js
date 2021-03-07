import { writeRankings } from './writeRankings'

export default function setPlayersWithoutChecking(data, state, dispatch) {
    dispatch({
        type: 'SET_NEW_PLAYERS',
        data,
    })
    if (state.settings) {
        writeRankings(
            data,
            state.settings.rankingsHtml,
            state.settings.rankingsHorizontal,
            'setPlayersWithoutChecking'
        )
    }
}