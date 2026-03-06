import { Store } from './types'

const initialStore: Store = {
    settingsView: false,

    settings: null,

    updateCheckDone: false,

    sorter: {
        name: 'byRank',
        reversed: false,
    },
}

export default initialStore
