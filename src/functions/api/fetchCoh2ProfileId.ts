import { fetchProfileIdBySteamId } from './fetchProfileIdBySteamId'

export async function fetchCoh2ProfileId(steamId: string): Promise<number | null> {
    return fetchProfileIdBySteamId(false, steamId)
}
