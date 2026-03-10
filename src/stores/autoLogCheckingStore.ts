import { create } from 'zustand'

import getLocalStorage from '../functions/getLocalStorage'

interface AutoLogCheckingStore {
    autoLogChecking: boolean
    toggleAutoLogChecking: () => void
}

export const useAutoLogCheckingStore = create<AutoLogCheckingStore>((set) => ({
    autoLogChecking: getLocalStorage({ key: 'autoLogChecking', def: true }),
    toggleAutoLogChecking: () =>
        set((state) => {
            const next = !state.autoLogChecking
            localStorage.setItem('autoLogChecking', JSON.stringify(next))
            return { autoLogChecking: next }
        }),
}))
