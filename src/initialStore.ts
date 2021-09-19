import { byRank } from './functions/sorters';
import getLocalStorage from './functions/getLocalStorage';

function importAll(r: any) {
    return r.keys().map(r);
}

const images: { default: string }[] = importAll(
    require.context('../img/countryFlags/', false, /\.(png|jpe?g|svg)$/)
);

interface CountryFlags {
    [key: string]: string;
}
const countryFlags: CountryFlags = {};
images.forEach((x: { default: string }) => {
    countryFlags[x.default.substring(4, 6)] = x.default;
});

interface InitialStore {
    settingsView: boolean;
    settings: any; // TODO
    logCheckInterval: number;
    autoLogChecking: boolean;
    alert: boolean;
    updateCheckDone: boolean;
    appLocation: string;
    players: any; // TODO
    fromFile: any; // TODO
    extraInfo: any; // TODO
    navButtons: {
        all: boolean;
        table: boolean;
        total: boolean;
    };
    openInfos: [boolean[], boolean[]];
    countryFlags: CountryFlags;
    sorter: {
        fun: (a: any, b: any) => number; // TODO
        name: string;
        reversed: boolean;
    };
    playerCard: {
        player: any; // TODO
    };
    view: string;
    foundPlayers: any[]; // TODO
}

let initialStore: InitialStore = {
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
        fun: byRank,
        name: 'byRank',
        reversed: false,
    },

    playerCard: {
        player: null,
    },

    view: 'main',

    foundPlayers: [],
};

export default initialStore;
