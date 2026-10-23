import { createContext, useContext } from 'react'

import { useNavButtonsStore } from '../stores/navButtonsStore'
import { usePlayerCardStore } from '../stores/playerCardStore'

/** True inside the player card, which can show the other game than the navbar. */
export const PlayerCardContext = createContext(false)

export function useDisplayCoh3(): boolean {
    const inPlayerCard = useContext(PlayerCardContext)
    const selectedCoh3 = usePlayerCardStore((s) => s.selectedCoh3)
    const navCoh3 = useNavButtonsStore((s) => s.navButtons.coh3)
    return inPlayerCard ? selectedCoh3 : navCoh3
}
