export function commonName(str: string): string {
    switch (str) {
        case 'british':
            return 'uk';
        case 'aef':
            return 'usa';
        case 'soviet':
            return 'sov';
        case 'west_german':
            return 'okw';
        case 'german':
            return 'wer';
        default:
            return '?????';
    }
}

interface Arr {
    ranks: [
        {
            wins: number;
            losses: number;
        }
    ];
}

export function getTotalGames(arr: Arr): number {
    let sum = 0;
    for (const rankObj of arr.ranks) {
        sum += rankObj.wins + rankObj.losses;
    }
    return sum;
}

export function separateTeams(arr: { teamSlot: number }[]): [any[], any[]] {
    let teams: [any[], any[]] = [[], []];
    for (let obj of arr) {
        if (obj.teamSlot === 0) {
            teams[0].push(obj);
        } else {
            teams[1].push(obj);
        }
    }
    return teams;
}

export function copyObj(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

export function formatToNums(arr: any[]): any[] {
    for (let obj of arr) {
        for (let key of Object.keys(obj)) {
            if (!isNaN(obj[key])) {
                obj[key] = +obj[key];
            }
        }
    }
    return arr;
}

export function getFactionName(x: string): string {
    switch (x) {
        case 'soviet':
            return 'Soviet';
        case 'german':
            return 'German';
        case 'aef':
            return 'AEF';
        case 'british':
            return 'British';
        case 'west_german':
            return 'WestGerman';
        default:
            return '';
    }
}

export function getFactionById(id: number): string {
    switch (id) {
        case 0:
            return 'wer';
        case 1:
            return 'sov';
        case 2:
            return 'okw';
        case 3:
            return 'usa';
        case 4:
            return 'uk';
        default:
            return '';
    }
}
