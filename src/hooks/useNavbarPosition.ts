import { useSettingsStore } from '../stores/settingsStore'
import { NavbarPosition } from '../types'

export default function useNavbarPosition(): NavbarPosition {
    const position = useSettingsStore((state) => state.settings?.navbarPosition)
    // The settings file is user-editable, so the saved position may be anything
    return position === 'left' || position === 'right' ? position : 'top'
}
