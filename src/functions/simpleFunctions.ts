import { PlayerFromFile } from '../types';

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

export function separateTeams(
    arr: { teamSlot: number }[]
): [PlayerFromFile[], PlayerFromFile[]] {
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

/**
 * Generic object copy
 * @param obj Object to copy
 * @returns Copy
 */
export function copyObj<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export function formatToNums(arr: PlayerFromFile[]): PlayerFromFile[] {
    for (let obj of arr) {
        if (obj.profileId && !isNaN(obj.profileId)) {
            obj.profileId = Number(obj.profileId);
        }
        if (
            obj.ranking &&
            typeof obj.ranking === 'number' &&
            !isNaN(obj.ranking)
        ) {
            obj.ranking = Number(obj.ranking);
        }
        if (obj.teamSlot && !isNaN(obj.teamSlot)) {
            obj.teamSlot = Number(obj.teamSlot);
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
