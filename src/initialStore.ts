import getLocalStorage from './functions/getLocalStorage'

import { Store } from './types'

const initialStore: Store = {
    settingsView: false,

    settings: null,

    logCheckInterval: getLocalStorage({
        key: 'logCheckInterval',
        def: 3,
    }),

    updateCheckDone: false,

    players: null,
    fromFile: null,
    navButtons: getLocalStorage({
        key: 'navButtons',
        def: {
            all: false,
            table: false,
            total: false,
        },
    }),

    openInfos: [
        [false, false, false, false],
        [false, false, false, false],
    ],

    sorter: {
        name: 'byRank',
        reversed: false,
    },

    playerCard: {
        player: null,
        extraInfo: null,
    },

    view: 'main',

    foundPlayers: [],
}

export default initialStore
