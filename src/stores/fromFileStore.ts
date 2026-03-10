import { create } from 'zustand'

import { Player } from '../types'

interface FromFileStore {
    fromFile: Player[] | null
    setFromFile: (fromFile: Player[]) => void
}

export const useFromFileStore = create<FromFileStore>((set) => ({
    fromFile: null,
    setFromFile: (fromFile) => set({ fromFile }),
}))
