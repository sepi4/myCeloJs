import { create } from 'zustand'

interface AppLocationStore {
    appLocation: string
}

export const useAppLocationStore = create<AppLocationStore>(() => ({
    appLocation: window.electronAPI.appLocation,
}))
