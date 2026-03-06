import getLocalStorage from './functions/getLocalStorage'

import { Store, CountryFlagsLocation } from './types'

const flagModules = import.meta.glob('../img/countryFlags/*.png', {
    eager: true,
}) as Record<string, { default: string }>

const countryFlags: CountryFlagsLocation = {}
Object.entries(flagModules).forEach(([path, mod]) => {
    const filename = path.split('/').pop() ?? ''
    const code = filename.substring(0, 2)
    countryFlags[code] = mod.default
})

const initialStore: Store = {
    settingsView: false,

    settings: null,

    logCheckInterval: getLocalStorage({
        key: 'logCheckInterval',
        def: 3,
    }),

    autoLogChecking: getLocalStorage({
        key: 'autoLogChecking',
        def: true,
    }),
updateCheckDone: false,

players: null,
    fromFile: null,
    extraInfo: null,

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

    countryFlags,

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
