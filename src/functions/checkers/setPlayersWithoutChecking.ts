import { useExtraInfoStore } from '../../stores/extraInfoStore'
import { useFromFileStore } from '../../stores/fromFileStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { useOpenInfosStore } from '../../stores/openInfosStore'
import { usePlayersStore } from '../../stores/playersStore'
import { Player } from '../../types'

export default function setPlayersWithoutChecking(data: Player[]) {
    useFromFileStore.getState().setFromFile(data)
    useOpenInfosStore.getState().resetOpenInfos()
    usePlayersStore.getState().setPlayers(data)
    useNavigationStore.getState().resetNavigation()
    useExtraInfoStore.getState().clearExtraInfo()
}
