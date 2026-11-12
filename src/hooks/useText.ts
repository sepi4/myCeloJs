import getText from '../functions/utils/getText'
import { useSettingsStore } from '../stores/settingsStore'
import { TextKey } from '../translations/translation'

export default function useText() {
    const language = useSettingsStore((state) => state.settings?.language)
    return (key: TextKey) => getText(key, language)
}
