import { Game } from '../../constants/games'
import { AvailableLeaderboard } from '../../types'
import { availableLeaderboardsUrl } from './apiUrls'

const cache = new Map<Game, Promise<AvailableLeaderboard>>()

export function fetchAvailableLeaderboards(game: Game): Promise<AvailableLeaderboard> {
    const cached = cache.get(game)
    if (cached) {
        return cached
    }
    const request = fetch(availableLeaderboardsUrl(game)).then((r) => {
        if (!r.ok) {
            throw new Error(`${r.status}`)
        }
        return r.json() as Promise<AvailableLeaderboard>
    })
    // A failed request must not stay cached, so the next call tries again.
    request.catch(() => cache.delete(game))
    cache.set(game, request)
    return request
}
