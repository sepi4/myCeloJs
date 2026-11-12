import { GAME_CONFIG } from '../constants/games'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'

/** Log file location of the game selected in the navbar, or '' when it is not set. */
export default function useActiveLogLocation(): string {
    const game = useGameStore((state) => state.game)
    return useSettingsStore((state) => state.settings?.[GAME_CONFIG[game].logLocationKey]) ?? ''
}
