import { useOpenPlayerDetailsStore } from './openPlayerDetailsStore'

beforeEach(() => {
    useOpenPlayerDetailsStore.getState().resetOpenPlayers()
})

describe('openPlayerDetailsStore', () => {
    test('toggleOpenPlayer opens and closes one player', () => {
        const { toggleOpenPlayer } = useOpenPlayerDetailsStore.getState()
        toggleOpenPlayer(10)
        expect(useOpenPlayerDetailsStore.getState().openPlayers).toEqual([10])
        toggleOpenPlayer(10)
        expect(useOpenPlayerDetailsStore.getState().openPlayers).toEqual([])
    })

    test('toggleOpenPlayers opens a team and leaves the other team as it is', () => {
        const { toggleOpenPlayer, toggleOpenPlayers } = useOpenPlayerDetailsStore.getState()
        toggleOpenPlayer(20)
        toggleOpenPlayers([10, 11])
        expect(useOpenPlayerDetailsStore.getState().openPlayers).toEqual([20, 10, 11])
    })

    test('team closed player by player can be opened again with one toggle', () => {
        const { toggleOpenPlayer, toggleOpenPlayers } = useOpenPlayerDetailsStore.getState()
        toggleOpenPlayers([10])
        toggleOpenPlayer(10)
        expect(useOpenPlayerDetailsStore.getState().openPlayers).toEqual([])
        toggleOpenPlayers([10])
        expect(useOpenPlayerDetailsStore.getState().openPlayers).toEqual([10])
    })

    test('resetOpenPlayers closes everything', () => {
        useOpenPlayerDetailsStore.getState().toggleOpenPlayers([1, 2])
        useOpenPlayerDetailsStore.getState().resetOpenPlayers()
        expect(useOpenPlayerDetailsStore.getState().openPlayers).toEqual([])
    })
})
