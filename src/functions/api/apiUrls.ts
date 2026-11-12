import { Game, GAME_CONFIG } from '../../constants/games'

function apiUrl(game: Game, endpoint: string, query = ''): string {
    const { apiBase, apiTitle } = GAME_CONFIG[game]
    return `${apiBase}/${endpoint}?title=${apiTitle}${query}`
}

export function personalStatByIdsUrl(game: Game, profileIds: number[]): string {
    return apiUrl(game, 'GetPersonalStat', `&profile_ids=[${profileIds.join(',')}]`)
}

export function personalStatBySteamIdUrl(game: Game, steamId: string): string {
    return apiUrl(game, 'GetPersonalStat', `&profile_names=[%22%2Fsteam%2F${steamId}%22]`)
}

export function personalStatSearchUrl(game: Game, searchValue: string): string {
    return apiUrl(game, 'GetPersonalStat', `&search=${searchValue}`)
}

export function availableLeaderboardsUrl(game: Game): string {
    return apiUrl(game, 'GetAvailableLeaderboards')
}

export function recentMatchHistoryUrl(game: Game, profileId: number | undefined): string {
    return apiUrl(game, 'getRecentMatchHistoryByProfileId', `&profile_id=${profileId}`)
}
