import { create } from 'zustand'

import getLocalStorage from '../functions/getLocalStorage'

export interface NavButtons {
    all: boolean
    table: boolean
    total: boolean
    coh3: boolean
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
        coh3: false,
        ...getLocalStorage({
            key: 'navButtons',
            def: { all: false, table: false, total: false },
        }),
    },
    toggleNavButton: (key) =>
        set((state) => {
            const updated = {
                ...state.navButtons,
                [key]: !state.navButtons[key],
            }
            localStorage.setItem('navButtons', JSON.stringify(updated))
            return { navButtons: updated }
        }),
}))
