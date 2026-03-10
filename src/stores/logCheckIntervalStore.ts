import { create } from 'zustand'

import getLocalStorage from '../functions/getLocalStorage'

interface LogCheckIntervalStore {
    logCheckInterval: number
    setLogCheckInterval: (logCheckInterval: number) => void
}

export const useLogCheckIntervalStore = create<LogCheckIntervalStore>((set) => ({
    logCheckInterval: getLocalStorage({ key: 'logCheckInterval', def: 3 }),
    setLogCheckInterval: (logCheckInterval) => {
        localStorage.setItem('logCheckInterval', JSON.stringify(logCheckInterval))
        set({ logCheckInterval })
    },
}))
