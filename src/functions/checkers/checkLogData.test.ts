/**
 * @jest-environment jsdom
 */

import { useExtraInfoStore } from '../../stores/extraInfoStore'
import { useFromFileStore } from '../../stores/fromFileStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useOpenInfosStore } from '../../stores/openInfosStore'
import { usePlayerCardStore } from '../../stores/playerCardStore'
import { usePlayersStore } from '../../stores/playersStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useViewStore } from '../../stores/viewStore'
import { Language, Player } from '../../types'
import { writeRankings } from '../rankings/writeRankings'
import checkLogData from './checkLogData'

jest.mock('../rankings/writeRankings', () => ({
    writeRankings: jest.fn(),
}))

const mockWriteRankings = writeRankings as jest.MockedFunction<typeof writeRankings>

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
}

function resetAllStores() {
    useFromFileStore.setState({ fromFile: null })
    useNavButtonsStore.setState({
        navButtons: { all: true, table: true, total: true, coh3: false },
    })
    useSettingsStore.setState({ settings: null })
    useExtraInfoStore.setState({ extraInfo: null })
    useOpenInfosStore.setState({
        openInfos: [
            [false, false, false, false],
            [false, false, false, false],
        ],
    })
    usePlayerCardStore.setState({ player: null, extraInfo: null })
    usePlayersStore.setState({ players: null })
    useViewStore.setState({ view: 'main' })
}

beforeEach(() => {
    jest.clearAllMocks()
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
        useOpenInfosStore.setState({
            openInfos: [
                [true, false, false, false],
                [false, false, false, false],
            ],
        })
        usePlayerCardStore.setState({
            player: { name: 'Old' },
            extraInfo: {} as never,
        })

        checkLogData({ data: [player1] })

        expect(useExtraInfoStore.getState().extraInfo).toBeNull()
        expect(useOpenInfosStore.getState().openInfos).toEqual([
            [false, false, false, false],
            [false, false, false, false],
        ])
        expect(usePlayerCardStore.getState().player).toBeNull()
    })

    it('calls writeRankings when settings exist', () => {
        useSettingsStore.setState({ settings })

        checkLogData({ data: [player1] })

        expect(mockWriteRankings).toHaveBeenCalledWith(false, [player1], true)
    })

    it('passes coh3 nav button value to writeRankings', () => {
        useSettingsStore.setState({ settings })
        useNavButtonsStore.setState({
            navButtons: { all: true, table: true, total: true, coh3: true },
        })

        checkLogData({ data: [player1] })

        expect(mockWriteRankings).toHaveBeenCalledWith(true, [player1], true)
    })

    it('does not call writeRankings when settings are null', () => {
        checkLogData({ data: [player1] })

        expect(mockWriteRankings).not.toHaveBeenCalled()
    })
})
