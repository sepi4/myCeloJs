import { create } from 'zustand'
import getLocalStorage from '../functions/getLocalStorage'

interface AlertStore {
    alert: boolean
    toggleAlert: () => void
}

export const useAlertStore = create<AlertStore>((set) => ({
    alert: getLocalStorage({ key: 'alert', def: false }),
    toggleAlert: () =>
        set((state) => {
            const next = !state.alert
            localStorage.setItem('alert', JSON.stringify(next))
            return { alert: next }
        }),
}))
