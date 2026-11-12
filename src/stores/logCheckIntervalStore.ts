import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { plainJsonStorage } from './plainJsonStorage'

interface LogCheckIntervalStore {
    logCheckInterval: number
    setLogCheckInterval: (logCheckInterval: number) => void
}

export const useLogCheckIntervalStore = create<LogCheckIntervalStore>()(
    persist(
        (set) => ({
            logCheckInterval: 3,
            setLogCheckInterval: (logCheckInterval) => set({ logCheckInterval }),
        }),
        {
            name: 'logCheckInterval',
            storage: plainJsonStorage('logCheckInterval'),
            partialize: ({ logCheckInterval }) => ({ logCheckInterval }),
        }
    )
)
