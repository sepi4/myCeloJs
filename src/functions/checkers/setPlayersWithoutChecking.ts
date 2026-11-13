import { useFromFileStore } from '../../stores/fromFileStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { useOpenPlayerDetailsStore } from '../../stores/openPlayerDetailsStore'
import { usePlayerRanksStore } from '../../stores/playerRanksStore'
import { usePlayersStore } from '../../stores/playersStore'
import { Player } from '../../types'

export default function setPlayersWithoutChecking(data: Player[]) {
    useFromFileStore.getState().setFromFile(data)
    useOpenPlayerDetailsStore.getState().resetOpenPlayers()
    usePlayersStore.getState().setPlayers(data)
    useNavigationStore.getState().resetNavigation()
    usePlayerRanksStore.getState().clearPlayerRanks()
}
