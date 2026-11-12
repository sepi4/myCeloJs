import { useEffect } from 'react'

import { fetchCoh2ProfileId } from '../functions/api/fetchCoh2ProfileId'
import { getLocalUserInfoCoh3 } from '../functions/log-parsing/getLocalUserInfoCoh3'
import { updateSettings } from '../functions/settings/writeSettings'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'

/** Keeps the user's own profile IDs in settings up to date. */
export default function useProfileIdSync() {
    const { game } = useGameStore()
    const { settings } = useSettingsStore()

    // COH3: the profile ID is in the log file
    useEffect(() => {
        const logLocation = settings?.logLocationCoh3
        if (game !== 'coh3' || !logLocation) {
            return
        }
        const savedProfileId = settings?.profileIdCoh3
        const updateCoh3ProfileId = async () => {
            const data = await window.electronAPI.log.read(logLocation)
            if (!data) {
                return
            }
            const info = getLocalUserInfoCoh3(data.split('\n'))
            if (!info || info.profileId === savedProfileId) {
                return
            }
            updateSettings({ profileIdCoh3: info.profileId })
        }
        updateCoh3ProfileId()
    }, [game, settings])

    // COH2: the profile ID is fetched with the Steam ID
    useEffect(() => {
        const steamId = settings?.steamId
        if (!steamId) {
            return
        }
        const savedProfileId = settings?.profileIdCoh2
        const updateCoh2ProfileId = async () => {
            const profileId = await fetchCoh2ProfileId(steamId)
            if (!profileId || profileId === savedProfileId) {
                return
            }
            updateSettings({ profileIdCoh2: profileId })
        }
        updateCoh2ProfileId()
    }, [settings])
}
