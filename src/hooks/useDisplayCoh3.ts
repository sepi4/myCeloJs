import { useNavButtonsStore } from '../stores/navButtonsStore'
import { usePlayerCardStore } from '../stores/playerCardStore'
import { useViewStore } from '../stores/viewStore'

export function useDisplayCoh3(): boolean {
    const view = useViewStore((s) => s.view)
    const selectedCoh3 = usePlayerCardStore((s) => s.selectedCoh3)
    const navCoh3 = useNavButtonsStore((s) => s.navButtons.coh3)
    return view === 'playerCard' ? selectedCoh3 : navCoh3
}
