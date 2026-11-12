import { fetchAvailableLeaderboards } from './fetchAvailableLeaderboards'

const okResponse = (body: unknown) => ({ ok: true, json: async () => body }) as Response

afterEach(() => {
    vi.unstubAllGlobals()
})

test('fetches the leaderboards once per game', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => okResponse({ leaderboards: [] }))
    vi.stubGlobal('fetch', fetchMock)

    await fetchAvailableLeaderboards('coh2')
    await fetchAvailableLeaderboards('coh2')

    expect(fetchMock).toHaveBeenCalledTimes(1)
})

test('tries again after a failed request', async () => {
    const fetchMock = vi
        .fn<typeof fetch>()
        .mockResolvedValueOnce({ ok: false, status: 500 } as Response)
        .mockResolvedValueOnce(okResponse({ leaderboards: [] }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchAvailableLeaderboards('coh3')).rejects.toThrow('500')
    await expect(fetchAvailableLeaderboards('coh3')).resolves.toEqual({ leaderboards: [] })
    expect(fetchMock).toHaveBeenCalledTimes(2)
})
