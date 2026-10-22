import dayjs from 'dayjs'
import { create } from 'zustand'

import getLocalStorage from '../functions/settings/getLocalStorage'

export const HISTORY_PERIODS = ['week', 'month', 'year', 'all'] as const
export type HistoryPeriod = (typeof HISTORY_PERIODS)[number]

interface HistoryPeriodStore {
    historyPeriod: HistoryPeriod
    setHistoryPeriod: (historyPeriod: HistoryPeriod) => void
}

function getStoredPeriod(): HistoryPeriod {
    const stored = getLocalStorage({ key: 'historyPeriod', def: 'all' })
    return HISTORY_PERIODS.includes(stored) ? stored : 'all'
}

export function isInPeriod(date: Date, period: HistoryPeriod, now = new Date()): boolean {
    if (period === 'all') {
        return true
    }
    return !dayjs(date).isBefore(dayjs(now).subtract(1, period))
}

export const useHistoryPeriodStore = create<HistoryPeriodStore>((set) => ({
    historyPeriod: getStoredPeriod(),
    setHistoryPeriod: (historyPeriod) => {
        localStorage.setItem('historyPeriod', JSON.stringify(historyPeriod))
        set({ historyPeriod })
    },
}))
