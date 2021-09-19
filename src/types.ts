export interface CountryFlagsLocation {
    [key: string]: string;
}

interface Settings {
    logLocation: string;
    language: string;
    appLocation: string;
    rankingsHtml: boolean;
    rankingsFile: string;
    rankingsHorizontal: boolean;
    siteLink: string;
    steamId: string;
    profileId: string;
}

export interface InitialStore {
    settingsView: boolean;
    settings: Settings | null;
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
        extraInfo: any; // TODO
    };
    view: string;
    foundPlayers: any[]; // TODO
}
