import { useSettingsStore } from '../stores/settingsStore'
import { Language } from '../types'

export default function useLanguage(): Language {
    const language = useSettingsStore((state) => state.settings?.language)
    // The settings file is user-editable, so the saved language may be anything
    return language === 'ru' ? 'ru' : 'en'
}
