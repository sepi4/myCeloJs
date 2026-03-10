import { create } from 'zustand'

interface SettingsViewStore {
    settingsView: boolean
    toggleSettingsView: () => void
}

export const useSettingsViewStore = create<SettingsViewStore>((set) => ({
    settingsView: false,
    toggleSettingsView: () => set((state) => ({ settingsView: !state.settingsView })),
}))
