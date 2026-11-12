import { useEffect } from 'react'

import { readSettings } from '../functions/settings/readSettings'
import writeSettings from '../functions/settings/writeSettings'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'

export default function useLoadSettings() {
    const { settings } = useSettingsStore()
    const { setGame } = useGameStore()

    // Load settings from disk on startup
    useEffect(() => {
        if (settings !== null) {
            return
        }
        async function loadSettings() {
            const savedSettings = await readSettings()
            if (!savedSettings) {
                return
            }
            window.electronAPI.rankings.setFormat(savedSettings.rankingsHtml ? 'html' : 'txt')
            writeSettings(savedSettings)
        }
        loadSettings()
    }, [settings])

    // Auto-select COH2/COH3 radio when only one log location is configured
    useEffect(() => {
        if (!settings) {
            return
        }
        const hasCoh2 = !!settings.logLocationCoh2
        const hasCoh3 = !!settings.logLocationCoh3
        if (hasCoh3 && !hasCoh2) {
            setGame('coh3')
        } else if (hasCoh2 && !hasCoh3) {
            setGame('coh2')
        }
    }, [settings, setGame])
}
