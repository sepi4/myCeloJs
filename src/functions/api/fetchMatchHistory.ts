import { Game } from '../../constants/games'
import { Player } from '../../types'
import { parseHistoryData } from '../utils/parseMatchHistory'
import { recentMatchHistoryUrl } from './apiUrls'
import { fetchAvailableLeaderboards } from './fetchAvailableLeaderboards'

export async function fetchMatchHistory(game: Game, player: Pick<Player, 'profileId'>) {
    const [matchHistory, leaderboards] = await Promise.all([
        fetch(recentMatchHistoryUrl(game, player.profileId)).then((r) => r.json()),
        fetchAvailableLeaderboards(game),
    ])
    return parseHistoryData([matchHistory, leaderboards], player)
}
