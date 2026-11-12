import { create } from 'zustand'

import getLocalStorage, { setLocalStorage } from '../functions/settings/getLocalStorage'

interface LogCheckIntervalStore {
    logCheckInterval: number
    setLogCheckInterval: (logCheckInterval: number) => void
}

export const useLogCheckIntervalStore = create<LogCheckIntervalStore>((set) => ({
    logCheckInterval: getLocalStorage('logCheckInterval', 3),
    setLogCheckInterval: (logCheckInterval) => {
        setLocalStorage('logCheckInterval', logCheckInterval)
        set({ logCheckInterval })
    },
}))
