import { useExtraInfoStore } from '../../stores/extraInfoStore'
import { useFromFileStore } from '../../stores/fromFileStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useOpenInfosStore } from '../../stores/openInfosStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { usePlayersStore } from '../../stores/playersStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useViewStore } from '../../stores/viewStore'
import { Player } from '../../types'
import checkLogData from './checkLogData'

const player1: Player = {
    name: 'Player1',
    faction: 'german',
    teamSlot: 0,
    time: '12:00',
}

const player2: Player = {
    name: 'Player2',
    faction: 'soviet',
    teamSlot: 1,
    time: '12:00',
}

function resetAllStores() {
    useFromFileStore.setState({ fromFile: null })
    useNavButtonsStore.setState({
        navButtons: { all: true, table: true, total: true, elo: false },
    })
    useSettingsStore.setState({ settings: null })
    useExtraInfoStore.setState({ extraInfo: null })
    useOpenInfosStore.setState({ openInfos: [] })
    usePlayerCardStore.getState().resetPlayerCard()
    usePlayersStore.setState({ players: null })
    useViewStore.setState({ view: 'main' })
}

beforeEach(() => {
    vi.clearAllMocks()
    resetAllStores()
})

describe('checkLogData', () => {
    it('updates stores when data differs from fromFile', () => {
        const data = [player1, player2]

        checkLogData({ data })

        expect(useFromFileStore.getState().fromFile).toEqual(data)
        expect(usePlayersStore.getState().players).toEqual(data)
        expect(useViewStore.getState().view).toBe('main')
    })

    it('does nothing when data matches fromFile', () => {
        const data = [player1]
        useFromFileStore.setState({ fromFile: [player1] })

        checkLogData({ data })

        // players should remain null since no update happened
        expect(usePlayersStore.getState().players).toBeNull()
    })

    it('clears extraInfo, openInfos, and playerCard on update', () => {
        useExtraInfoStore.setState({ extraInfo: { '1': {} as never } })
        useOpenInfosStore.setState({ openInfos: [1] })
        usePlayerCardStore.getState().setPlayerCard({ name: 'Old' }, {} as never, 'coh2')

        checkLogData({ data: [player1] })

        expect(useExtraInfoStore.getState().extraInfo).toBeNull()
        expect(useOpenInfosStore.getState().openInfos).toEqual([])
        expect(usePlayerCardStore.getState().player).toBeNull()
    })
})
