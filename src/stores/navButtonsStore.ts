import { create } from 'zustand'

import getLocalStorage, { setLocalStorage } from '../functions/settings/getLocalStorage'

export interface NavButtons {
    all: boolean
    table: boolean
    total: boolean
    elo: boolean
}

interface NavButtonsStore {
    navButtons: NavButtons
    toggleNavButton: (key: keyof NavButtons) => void
}

export const useNavButtonsStore = create<NavButtonsStore>((set) => ({
    navButtons: {
        all: false,
        table: false,
        total: false,
        elo: false,
        ...getLocalStorage<Partial<NavButtons>>('navButtons', {}),
    },
    toggleNavButton: (key) =>
        set((state) => {
            const updated = {
                ...state.navButtons,
                [key]: !state.navButtons[key],
            }
            setLocalStorage('navButtons', updated)
            return { navButtons: updated }
        }),
}))
