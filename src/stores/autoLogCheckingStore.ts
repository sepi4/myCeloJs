import { create } from 'zustand'

import getLocalStorage, { setLocalStorage } from '../functions/settings/getLocalStorage'

interface AutoLogCheckingStore {
    autoLogChecking: boolean
    toggleAutoLogChecking: () => void
}

export const useAutoLogCheckingStore = create<AutoLogCheckingStore>((set) => ({
    autoLogChecking: getLocalStorage('autoLogChecking', true),
    toggleAutoLogChecking: () =>
        set((state) => {
            setLocalStorage('autoLogChecking', !state.autoLogChecking)
            return { autoLogChecking: !state.autoLogChecking }
        }),
}))
