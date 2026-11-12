import { Game } from '../../constants/games'
import { Player } from '../../types'
import { parseHistoryData } from '../utils/parseMatchHistory'
import { availableLeaderboardsUrl, recentMatchHistoryUrl } from './apiUrls'

export async function fetchMatchHistory(game: Game, player: Player) {
    const [matchHistory, leaderboards] = await Promise.all([
        fetch(recentMatchHistoryUrl(game, player.profileId)).then((r) => r.json()),
        fetch(availableLeaderboardsUrl(game)).then((r) => r.json()),
    ])
    return parseHistoryData([matchHistory, leaderboards], player)
}
