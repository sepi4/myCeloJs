import { Game } from '../../constants/games'
import { AvailableLeaderboard } from '../../types'
import { availableLeaderboardsUrl } from './apiUrls'

const cache = new Map<Game, Promise<AvailableLeaderboard>>()

/** The list changes only with a game update, so it is fetched once per game. */
export function fetchAvailableLeaderboards(game: Game): Promise<AvailableLeaderboard> {
    let request = cache.get(game)
    if (!request) {
        request = fetch(availableLeaderboardsUrl(game)).then((r) => {
            if (!r.ok) {
                throw new Error(`${r.status}`)
            }
            return r.json() as Promise<AvailableLeaderboard>
        })
        // A failed request must not stay in the cache, or it could never be retried.
        request.catch(() => cache.delete(game))
        cache.set(game, request)
    }
    return request
}
