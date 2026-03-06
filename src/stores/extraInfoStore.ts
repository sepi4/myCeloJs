import { create } from 'zustand'
import { NormalizedExtraInfo } from '../types'

interface ExtraInfoStore {
    extraInfo: NormalizedExtraInfo | null
    setExtraInfo: (extraInfo: NormalizedExtraInfo) => void
    clearExtraInfo: () => void
}

export const useExtraInfoStore = create<ExtraInfoStore>((set) => ({
    extraInfo: null,
    setExtraInfo: (extraInfo) => set({ extraInfo }),
    clearExtraInfo: () => set({ extraInfo: null }),
}))
