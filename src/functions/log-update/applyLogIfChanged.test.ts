import { useDisplayOptionsStore } from '../../stores/displayOptionsStore'
import { useLastLogPlayersStore } from '../../stores/lastLogPlayersStore'
import { useOpenPlayerDetailsStore } from '../../stores/openPlayerDetailsStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { usePlayerRanksStore } from '../../stores/playerRanksStore'
import { usePlayersStore } from '../../stores/playersStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useViewStore } from '../../stores/viewStore'
import { Player } from '../../types'
import applyLogIfChanged from './applyLogIfChanged'

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
    useLastLogPlayersStore.setState({ lastLogPlayers: null })
    useDisplayOptionsStore.setState({
        displayOptions: { showAll: true, tableView: true, showTotal: true, showElo: false },
    })
    useSettingsStore.setState({ settings: null })
    usePlayerRanksStore.setState({ playerRanks: null })
    useOpenPlayerDetailsStore.setState({ openPlayers: [] })
    usePlayerCardStore.getState().resetPlayerCard()
    usePlayersStore.setState({ players: null })
    useViewStore.setState({ view: 'main' })
}

beforeEach(() => {
    vi.clearAllMocks()
    resetAllStores()
})

describe('applyLogIfChanged', () => {
    it('updates stores when data differs from lastLogPlayers', () => {
        const data = [player1, player2]

        applyLogIfChanged({ data })

        expect(useLastLogPlayersStore.getState().lastLogPlayers).toEqual(data)
        expect(usePlayersStore.getState().players).toEqual(data)
        expect(useViewStore.getState().view).toBe('main')
    })

    it('does nothing when data matches lastLogPlayers', () => {
        const data = [player1]
        useLastLogPlayersStore.setState({ lastLogPlayers: [player1] })

        applyLogIfChanged({ data })

        // players should remain null since no update happened
        expect(usePlayersStore.getState().players).toBeNull()
    })

    it('clears playerRanks, openPlayers, and playerCard on update', () => {
        usePlayerRanksStore.setState({ playerRanks: { '1': {} as never } })
        useOpenPlayerDetailsStore.setState({ openPlayers: [1] })
        usePlayerCardStore.getState().setPlayerCard({ name: 'Old' }, {} as never, 'coh2')

        applyLogIfChanged({ data: [player1] })

        expect(usePlayerRanksStore.getState().playerRanks).toBeNull()
        expect(useOpenPlayerDetailsStore.getState().openPlayers).toEqual([])
        expect(usePlayerCardStore.getState().player).toBeNull()
    })
})
