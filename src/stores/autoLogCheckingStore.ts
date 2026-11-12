import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { plainJsonStorage } from './plainJsonStorage'

interface AutoLogCheckingStore {
    autoLogChecking: boolean
    toggleAutoLogChecking: () => void
}

export const useAutoLogCheckingStore = create<AutoLogCheckingStore>()(
    persist(
        (set) => ({
            autoLogChecking: true,
            toggleAutoLogChecking: () =>
                set((state) => ({ autoLogChecking: !state.autoLogChecking })),
        }),
        {
            name: 'autoLogChecking',
            storage: plainJsonStorage('autoLogChecking'),
            partialize: ({ autoLogChecking }) => ({ autoLogChecking }),
        }
    )
)
