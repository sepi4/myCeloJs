import { create } from 'zustand'

interface UpdateCheckDoneStore {
    updateCheckDone: boolean
    setUpdateCheckDone: () => void
}

export const useUpdateCheckDoneStore = create<UpdateCheckDoneStore>((set) => ({
    updateCheckDone: false,
    setUpdateCheckDone: () => set({ updateCheckDone: true }),
}))
