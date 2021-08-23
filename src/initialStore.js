import { byRank } from './functions/sorters'
import getLocalStorage from './functions/getLocalStorage'

function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(
    require.context(
        '../img/countryFlags/',
        false,
        /\.(png|jpe?g|svg)$/
    )
)

let countryFlags = {}
images.forEach(x => {
    countryFlags[x.default.substring(4, 6)] = x.default
})

let initialStore = {

    settingsView: false,
    settings: null,
    logCheckInterval: getLocalStorage('logCheckInterval', 3),


    autoLogChecking: getLocalStorage('autoLogChecking', true),

    alert: getLocalStorage('alert', false),

    updateCheckDone: false,

    appLocation: process.cwd(),

    players: null,
    fromFile: null,
    extraInfo: null,

    navButtons: getLocalStorage(
        'navButtons',
        {
            all: false,
            table: false,
            total: false,
        },
    ),

    openInfos: [
        [false, false, false, false,],
        [false, false, false, false,],
    ],

    countryFlags,

    sorter: {
        fun: byRank,
        name: 'byRank',
        reversed: false,
    },

    playerCard: {
        player: null,
    },

    view: 'main',

    foundPlayers: [],

}

export default initialStore