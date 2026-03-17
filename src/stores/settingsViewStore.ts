import { create } from 'zustand'

interface SettingsViewStore {
    settingsView: boolean
    openSettingsView: () => void
    closeSettingsView: () => void
}

export const useSettingsViewStore = create<SettingsViewStore>((set) => ({
    settingsView: false,
    openSettingsView: () => set({ settingsView: true }),
    closeSettingsView: () => set({ settingsView: false }),
}))
