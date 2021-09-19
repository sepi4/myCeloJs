export interface CountryFlagsLocation {
    [key: string]: string;
}

export interface InitialStore {
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
    countryFlags: CountryFlagsLocation;
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
