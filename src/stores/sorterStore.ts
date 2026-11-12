import { create } from 'zustand'

import { Sorter, SorterName } from '../functions/rankings/sorters'

interface SorterStore {
    sorter: Sorter
    setSorter: (name: SorterName) => void
}

export const useSorterStore = create<SorterStore>((set) => ({
    sorter: { name: 'byRank', reversed: false },
    setSorter: (name) =>
        set((state) => ({
            sorter:
                state.sorter.name === name
                    ? { name, reversed: !state.sorter.reversed }
                    : { name, reversed: false },
        })),
}))
