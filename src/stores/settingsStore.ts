import { create } from 'zustand'

import { SettingsType } from '../types'

interface SettingsStore {
    settings: SettingsType | null
    setSettings: (settings: SettingsType) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    settings: null,
    setSettings: (settings) => set({ settings }),
}))
