import { useExtraInfoStore } from '../../stores/extraInfoStore'
import { useFromFileStore } from '../../stores/fromFileStore'
import { useGameStore } from '../../stores/gameStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useOpenInfosStore } from '../../stores/openInfosStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { usePlayersStore } from '../../stores/playersStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useViewStore } from '../../stores/viewStore'
import { Language, Player } from '../../types'
import { writeRankings } from '../rankings/writeRankings'
import checkLogData from './checkLogData'

vi.mock('../rankings/writeRankings', () => ({
    writeRankings: vi.fn<typeof writeRankings>(),
}))

const mockWriteRankings = vi.mocked(writeRankings)

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

const settings = {
    logLocationCoh2: '/path/coh2',
    logLocationCoh3: '/path/coh3',
    language: 'en' as Language,
    appLocation: '/app',
    rankingsHtml: true,
    rankingsPort: 2222,
    rankingsHorizontal: true,
    steamId: '123',
    profileIdCoh2: 456,
    profileIdCoh3: 789,
    navbarPosition: 'top' as const,
    fontSize: 'small' as const,
    theme: 'dark' as const,
}

function resetAllStores() {
    useFromFileStore.setState({ fromFile: null })
    useNavButtonsStore.setState({
        navButtons: { all: true, table: true, total: true, elo: false },
    })
    useGameStore.setState({ game: 'coh2' })
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

    it('calls writeRankings when settings exist', () => {
        useSettingsStore.setState({ settings })

        checkLogData({ data: [player1] })

        expect(mockWriteRankings).toHaveBeenCalledWith('coh2', [player1], true, false)
    })

    it('passes the selected game to writeRankings', () => {
        useSettingsStore.setState({ settings })
        useGameStore.setState({ game: 'coh3' })

        checkLogData({ data: [player1] })

        expect(mockWriteRankings).toHaveBeenCalledWith('coh3', [player1], true, false)
    })

    it('does not call writeRankings when settings are null', () => {
        checkLogData({ data: [player1] })

        expect(mockWriteRankings).not.toHaveBeenCalled()
    })
})
