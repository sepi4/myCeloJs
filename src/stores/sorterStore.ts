import { create } from 'zustand'

interface Sorter {
    name: 'byRank' | 'byWinRate' | 'byStreak' | 'byName' | 'byTotal'
    reversed: boolean
}

interface SorterStore {
    sorter: Sorter
    setSorter: (name: Sorter['name']) => void
}

export const useSorterStore = create<SorterStore>((set) => ({
    sorter: { name: 'byRank', reversed: false },
    setSorter: (name: Sorter['name']) =>
        set((state) => ({
            sorter:
                state.sorter.name === name
                    ? { name, reversed: !state.sorter.reversed }
                    : { name, reversed: false },
        })),
}))
