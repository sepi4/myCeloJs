import { create } from 'zustand'

const defaultOpenInfos = (): boolean[][] => [
    [false, false, false, false],
    [false, false, false, false],
]

interface OpenInfosStore {
    openInfos: boolean[][]
    toggleOpenInfo: (teamIndex: number, playerIndex: number) => void
    resetOpenInfos: () => void
}

export const useOpenInfosStore = create<OpenInfosStore>((set) => ({
    openInfos: defaultOpenInfos(),
    toggleOpenInfo: (teamIndex, playerIndex) =>
        set((state) => ({
            openInfos: state.openInfos.map((t, i) =>
                i === teamIndex ? t.map((p, j) => (j === playerIndex ? !p : p)) : t
            ),
        })),
    resetOpenInfos: () => set({ openInfos: defaultOpenInfos() }),
}))
