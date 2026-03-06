import { Store } from './types'

const initialStore: Store = {
    settingsView: false,

    settings: null,

    updateCheckDone: false,

    players: null,
    sorter: {
        name: 'byRank',
        reversed: false,
    },

    view: 'main',
}

export default initialStore
