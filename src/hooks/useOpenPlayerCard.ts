import { fetchPlayerRanks } from '../functions/api/fetchPlayerRanks'
import { useNavigationStore } from '../stores/navigationStore'
import { PlayerCardData } from '../stores/playerCardStore'
import { useDisplayGame } from './useDisplayGame'

/** Returns a function that fetches a player's ranks and then opens the player card. */
export default function useOpenPlayerCard() {
    const game = useDisplayGame()
    const openPlayerCard = useNavigationStore((state) => state.openPlayerCard)

    return async (player: PlayerCardData & { profileId: number }) => {
        const playerRanks = await fetchPlayerRanks(game, player.profileId)
        if (playerRanks) {
            openPlayerCard(player, playerRanks, game)
        }
    }
}
