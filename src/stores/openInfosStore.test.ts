import { useOpenInfosStore } from './openInfosStore'

beforeEach(() => {
    useOpenInfosStore.getState().resetOpenInfos()
})

describe('openInfosStore', () => {
    test('toggleOpenInfo opens and closes one player', () => {
        const { toggleOpenInfo } = useOpenInfosStore.getState()
        toggleOpenInfo(10)
        expect(useOpenInfosStore.getState().openInfos).toEqual([10])
        toggleOpenInfo(10)
        expect(useOpenInfosStore.getState().openInfos).toEqual([])
    })

    test('toggleOpenInfos opens a team and leaves the other team as it is', () => {
        const { toggleOpenInfo, toggleOpenInfos } = useOpenInfosStore.getState()
        toggleOpenInfo(20)
        toggleOpenInfos([10, 11])
        expect(useOpenInfosStore.getState().openInfos).toEqual([20, 10, 11])
    })

    test('team closed player by player can be opened again with one toggle', () => {
        const { toggleOpenInfo, toggleOpenInfos } = useOpenInfosStore.getState()
        toggleOpenInfos([10])
        toggleOpenInfo(10)
        expect(useOpenInfosStore.getState().openInfos).toEqual([])
        toggleOpenInfos([10])
        expect(useOpenInfosStore.getState().openInfos).toEqual([10])
    })

    test('resetOpenInfos closes everything', () => {
        useOpenInfosStore.getState().toggleOpenInfos([1, 2])
        useOpenInfosStore.getState().resetOpenInfos()
        expect(useOpenInfosStore.getState().openInfos).toEqual([])
    })
})
