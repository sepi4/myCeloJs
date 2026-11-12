import { fetchAvailableLeaderboards } from './fetchAvailableLeaderboards'

const mockFetch = vi.fn<typeof fetch>()

beforeEach(() => {
    mockFetch.mockReset()
    vi.stubGlobal('fetch', mockFetch)
})

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('fetchAvailableLeaderboards', () => {
    it('retries after a failure and then fetches only once per game', async () => {
        mockFetch.mockResolvedValueOnce(new Response('', { status: 500 }))
        await expect(fetchAvailableLeaderboards('coh2')).rejects.toThrow('500')

        mockFetch.mockImplementation(async () => Response.json({ leaderboards: [] }))
        const first = await fetchAvailableLeaderboards('coh2')
        const second = await fetchAvailableLeaderboards('coh2')

        expect(second).toBe(first)
        expect(mockFetch).toHaveBeenCalledTimes(2)

        await fetchAvailableLeaderboards('coh3')
        expect(mockFetch).toHaveBeenCalledTimes(3)
    })
})
