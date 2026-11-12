import { useEffect } from 'react'

import { fetchCoh2ProfileId } from '../functions/api/fetchCoh2ProfileId'
import { getLocalUserInfoCoh3 } from '../functions/log-parsing/getLocalUserInfoCoh3'
import { updateSettings } from '../functions/settings/writeSettings'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'

/** Keeps the user's own profile IDs in settings up to date. */
export default function useProfileIdSync() {
    const { game } = useGameStore()
    // Only these values matter, so other settings changes do not read the log or call the API.
    const logLocation = useSettingsStore((s) => s.settings?.logLocationCoh3)
    const steamId = useSettingsStore((s) => s.settings?.steamId)

    // COH3: the profile ID is in the log file
    useEffect(() => {
        if (game !== 'coh3' || !logLocation) {
            return
        }
        const updateCoh3ProfileId = async () => {
            const data = await window.electronAPI.log.read(logLocation)
            if (!data) {
                return
            }
            const info = getLocalUserInfoCoh3(data.split('\n'))
            if (!info || info.profileId === useSettingsStore.getState().settings?.profileIdCoh3) {
                return
            }
            updateSettings({ profileIdCoh3: info.profileId })
        }
        updateCoh3ProfileId()
    }, [game, logLocation])

    // COH2: the profile ID is fetched with the Steam ID
    useEffect(() => {
        if (!steamId) {
            return
        }
        const updateCoh2ProfileId = async () => {
            const profileId = await fetchCoh2ProfileId(steamId)
            if (!profileId || profileId === useSettingsStore.getState().settings?.profileIdCoh2) {
                return
            }
            updateSettings({ profileIdCoh2: profileId })
        }
        updateCoh2ProfileId()
    }, [steamId])
}
