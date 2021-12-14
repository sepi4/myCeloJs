import getLocalStorage from './functions/getLocalStorage'

import { Store, CountryFlagsLocation } from './types'

function importAll(r: any) {
    return r.keys().map(r)
}

const images: { default: string }[] = importAll(
    require.context('../img/countryFlags/', false, /\.(png|jpe?g|svg)$/)
)

const countryFlags: CountryFlagsLocation = {}
images.forEach((x: { default: string }) => {
    countryFlags[x.default.substring(4, 6)] = x.default
})

let initialStore: Store = {
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
    alert: getLocalStorage({
        key: 'alert',
        def: false,
    }),

    updateCheckDone: false,

    appLocation: process.cwd(),

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
