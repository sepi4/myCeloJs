import { create } from 'zustand'
import { DataFromFile } from '../types'

interface FromFileStore {
    fromFile: DataFromFile[] | null
    setFromFile: (fromFile: DataFromFile[]) => void
}

export const useFromFileStore = create<FromFileStore>((set) => ({
    fromFile: null,
    setFromFile: (fromFile) => set({ fromFile }),
}))
