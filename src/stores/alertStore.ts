import { create } from 'zustand'

import getLocalStorage, { setLocalStorage } from '../functions/settings/getLocalStorage'

interface AlertStore {
    alert: boolean
    toggleAlert: () => void
}

export const useAlertStore = create<AlertStore>((set) => ({
    alert: getLocalStorage('alert', false),
    toggleAlert: () =>
        set((state) => {
            setLocalStorage('alert', !state.alert)
            return { alert: !state.alert }
        }),
}))
