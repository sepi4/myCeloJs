import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { plainJsonStorage } from './plainJsonStorage'

interface AlertStore {
    alert: boolean
    toggleAlert: () => void
}

export const useAlertStore = create<AlertStore>()(
    persist(
        (set) => ({
            alert: false,
            toggleAlert: () => set((state) => ({ alert: !state.alert })),
        }),
        {
            name: 'alert',
            storage: plainJsonStorage('alert'),
            partialize: ({ alert }) => ({ alert }),
        }
    )
)
