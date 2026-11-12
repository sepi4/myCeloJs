import { fetchPlayerExtraInfo } from '../functions/api/getExtraInfo'
import { useNavigationStore } from '../stores/navigationStore'
import { PlayerCardData } from '../stores/playerCardStore'
import { useDisplayGame } from './useDisplayGame'

/** Returns a function that fetches a player's ranks and then opens the player card. */
export default function useOpenPlayerCard() {
    const game = useDisplayGame()
    const openPlayerCard = useNavigationStore((state) => state.openPlayerCard)

    return async (player: PlayerCardData & { profileId: number }) => {
        const extraInfo = await fetchPlayerExtraInfo(game, player.profileId)
        if (extraInfo) {
            openPlayerCard(player, extraInfo, game)
        }
    }
}
