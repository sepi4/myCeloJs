import fs from 'fs';
import { commonName } from './simpleFunctions';
import countriesJson from '../../countries.json';
// import countries from '../../countries.json';
import stringWidth from 'string-width';

import { PlayerFromFile, RankingsJson } from '../types';

interface Countries {
    [key: string]: {
        ['name']: string;
        ['alpha-2']: string;
        ['alpha-3']: string;
        ['country-code']: string;
        ['iso_3166-2']: string;
        ['region']: string;
        ['sub-region']: string;
        ['intermediate-region']: string;
        ['region-code']: string;
        ['sub-region-code']: string;
        ['intermediate-region-code']: string;
    };
}

const countries: Countries = countriesJson;

function countryText(s: string | undefined, left: boolean, n: number) {
    let x = '';
    if (s && s.length > 0 && countries[s]) {
        x = countries[s]['alpha-3'];
    }
    if (left) {
        x = x.padStart(n);
    } else {
        x = x.padEnd(n);
    }
    return x;
}

function getLimitedWord(str: string, limit: number, padLeft: boolean) {
    let sum = 0;
    let newStr = '';
    for (const x of str) {
        const sw = stringWidth(x);
        // console.log(x, sw)
        if (sum + sw <= limit) {
            sum += sw;
            newStr += x;
        } else {
            break;
        }
    }
    if (padLeft) {
        newStr = ' '.repeat(limit - sum) + newStr;
        return newStr;
    }
    return newStr + ' '.repeat(limit - sum);
}

export function writeRankings(
    players: PlayerFromFile[],
    rankingsHorizontal: boolean,
    from?: string
): void {
    // console.log('writeRankings: players:', players);

    let json: RankingsJson = {
        teams: {
            team1: [],
            team2: [],
        },
        horizontal: false,
    };

    let rowsLeft = [];
    let rowsRight = [];
    for (let i = 0; i < players.length; i++) {
        const country = players[i].country ? players[i].country : '';
        const name = players[i].name;

        // prettier-ignore
        let ranking = players[i].ranking === -1 ? '-' 
            : players[i].ranking?.toString();

        if (ranking === undefined) {
            ranking = '-';
        }

        const faction = players[i].faction;
        const teamSlot = Number(players[i].teamSlot);

        const maxNameLength = 20;
        if (rankingsHorizontal) {
            if (teamSlot % 2 === 0) {
                const text =
                    getLimitedWord(name, maxNameLength, true) +
                    ' ' +
                    countryText(country, true, 5) +
                    ' ' +
                    ranking.padStart(5) +
                    ' ' +
                    commonName(faction).padStart(5).toUpperCase();
                rowsLeft.push(text);
            } else {
                const text =
                    commonName(faction).padEnd(5).toUpperCase() +
                    ' ' +
                    ranking.padEnd(5) +
                    ' ' +
                    countryText(country, false, 5) +
                    ' ' +
                    getLimitedWord(name, maxNameLength, false);
                rowsRight.push(text);
            }
        } else {
            const text =
                commonName(faction).padEnd(5).toUpperCase() +
                ' ' +
                ranking.padEnd(5) +
                ' ' +
                countryText(country, false, 5) +
                ' ' +
                getLimitedWord(name, maxNameLength, false);

            if (teamSlot % 2 === 0) {
                rowsRight.push(text);
            } else {
                rowsLeft.push(text);
            }
        }

        if (teamSlot % 2 === 0) {
            json.teams.team1.push({
                name,
                ranking,
                country,
                faction: commonName(faction),
            });
        } else {
            json.teams.team2.push({
                name,
                ranking,
                country,
                faction: commonName(faction),
            });
        }
    }

    json.horizontal = rankingsHorizontal;

    let text = '';
    if (rankingsHorizontal) {
        for (let i = 0; i < rowsLeft.length; i++) {
            text += rowsLeft[i] + '           ' + rowsRight[i] + '\n';
        }
    } else {
        for (let i = 0; i < rowsLeft.length; i++) {
            text += rowsLeft[i] + '\n';
        }
        text += '\n';
        for (let i = 0; i < rowsRight.length; i++) {
            text += rowsRight[i] + '\n';
        }
    }

    fs.writeFile(
        process.cwd() + '/localhostFiles/rankings.json',
        JSON.stringify(json, null, 4),
        'utf-8',
        (err) => {
            if (err) {
                console.log('Error in writing rankings.json file: ', err);
            }
        }
    );
    fs.writeFile(
        process.cwd() + '/localhostFiles/rankings.txt',
        text,
        'utf-8',
        (err) => {
            if (err) {
                console.log('Error in writing rankings.txt file: ', err);
            }
        }
    );
}
