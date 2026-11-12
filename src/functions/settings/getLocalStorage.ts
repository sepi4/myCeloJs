interface NavButtons {
    key: 'navButtons'
    def: {
        all: boolean
        table: boolean
        total: boolean
    }
}

interface HistoryPeriod {
    key: 'historyPeriod'
    def: 'week' | 'month' | 'year' | 'all'
}

type Props = NavButtons | HistoryPeriod

export default function getLocalStorage({ key, def }: Props) {
    const str = localStorage.getItem(key)
    if (str !== undefined && str !== null) {
        return JSON.parse(str)
    }
    return def
}
