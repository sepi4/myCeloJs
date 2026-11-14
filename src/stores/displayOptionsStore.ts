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
        tableView: true,
        showTotal: true,
        showElo: true,
        ...getLocalStorage<Partial<DisplayOptions>>('displayOptions', {}),
    },
    toggleDisplayOption: (key) =>
        set((state) => {
            const value = !state.displayOptions[key]
            // Save only the options the user changed, so the others keep following the defaults.
            setLocalStorage('displayOptions', {
                ...getLocalStorage<Partial<DisplayOptions>>('displayOptions', {}),
                [key]: value,
            })
            return { displayOptions: { ...state.displayOptions, [key]: value } }
        }),
}))
