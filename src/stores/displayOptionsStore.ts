import { create } from 'zustand'

import getLocalStorage, { setLocalStorage } from '../functions/settings/getLocalStorage'

export interface DisplayOptions {
    showAll: boolean
    tableView: boolean
    showTotal: boolean
    showElo: boolean
}

interface DisplayOptionsStore {
    displayOptions: DisplayOptions
    toggleDisplayOption: (key: keyof DisplayOptions) => void
}

export const useDisplayOptionsStore = create<DisplayOptionsStore>((set) => ({
    displayOptions: {
        showAll: false,
        tableView: false,
        showTotal: false,
        showElo: false,
        ...getLocalStorage<Partial<DisplayOptions>>('displayOptions', {}),
    },
    toggleDisplayOption: (key) =>
        set((state) => {
            const updated = {
                ...state.displayOptions,
                [key]: !state.displayOptions[key],
            }
            setLocalStorage('displayOptions', updated)
            return { displayOptions: updated }
        }),
}))
