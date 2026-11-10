import { useExtraInfoStore } from '../../stores/extraInfoStore'
import { useFromFileStore } from '../../stores/fromFileStore'
import { useNavButtonsStore } from '../../stores/navButtonsStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { useOpenInfosStore } from '../../stores/openInfosStore'
import { usePlayersStore } from '../../stores/playersStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { Player } from '../../types'
import { writeRankings } from '../rankings/writeRankings'

export default function setPlayersWithoutChecking(data: Player[]) {
    useFromFileStore.getState().setFromFile(data)
    useOpenInfosStore.getState().resetOpenInfos()
    usePlayersStore.getState().setPlayers(data)
    useNavigationStore.getState().resetNavigation()
    const {
        navButtons: { coh3, elo },
    } = useNavButtonsStore.getState()
    const { settings } = useSettingsStore.getState()
    useExtraInfoStore.getState().clearExtraInfo()
    if (settings) {
        writeRankings(coh3, data, settings.rankingsHorizontal, coh3 && elo)
    }
}
