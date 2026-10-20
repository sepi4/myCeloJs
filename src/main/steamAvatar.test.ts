import { fetchSteamAvatar } from './steamAvatar'

const avatarUrl = 'https://avatars.steamstatic.com/example_medium.jpg'
const avatarXml = `<avatarMedium><![CDATA[${avatarUrl}]]></avatarMedium>`

afterEach(() => {
    jest.restoreAllMocks()
})

it.each([429, 503, 200])('retries after a failed avatar lookup with HTTP %i', async (status) => {
    const fetchMock = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response('<error>Temporarily unavailable</error>', { status }))
        .mockResolvedValueOnce(new Response(avatarXml))
    const steamId = String(status)

    expect(await fetchSteamAvatar(steamId)).toBeNull()
    expect(await fetchSteamAvatar(steamId)).toBe(avatarUrl)
    expect(await fetchSteamAvatar(steamId)).toBe(avatarUrl)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenLastCalledWith(
        `https://steamcommunity.com/profiles/${steamId}?xml=1`
    )
})

it('retries after a network error', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    const fetchMock = jest
        .spyOn(globalThis, 'fetch')
        .mockRejectedValueOnce(new Error('Network unavailable'))
        .mockResolvedValueOnce(new Response(avatarXml))

    expect(await fetchSteamAvatar('1')).toBeNull()
    expect(await fetchSteamAvatar('1')).toBe(avatarUrl)
    expect(fetchMock).toHaveBeenCalledTimes(2)
})

it.each(['', 'invalid'])('does not fetch an invalid Steam ID: %s', async (steamId) => {
    const fetchMock = jest.spyOn(globalThis, 'fetch')

    expect(await fetchSteamAvatar(steamId)).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
})
