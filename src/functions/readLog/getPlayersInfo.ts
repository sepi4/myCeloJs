import { Player } from '../../types';

export function getPlayersInfo(arr: string[]) {
    let time: string | undefined;
    arr = arr.map((row) => {
        if (row.match(/GAME --.* Player:/)) {
            let splited = row.split(':');
            if (time === undefined) {
                time = [
                    splited[0],
                    splited[1],
                    splited[2].split('   ')[0],
                ].join(':');
            }

            return splited.slice(3).join(':').trim();
        } else {
            let splited = row.split(':');
            return splited[splited.length - 1].trim();
        }
    });

    type SteamId = {
        id: string;
        slot: string;
        ranking: string;
        time: string | undefined;
    };

    let steamIds: {
        [key: string]: SteamId;
    } = {};

    let players: {
        [key: string]: Player;
    } = {};
    for (let row of arr) {
        let idMatch = row.match(/^.*\/steam\/(\d+).+/);
        let id: string;
        let slotMatch = row.match(/, slot = +(\d), ranking/);
        let slot: string | undefined;
        let rankingMatch = row.match(/, ranking = +(-?\d+)/);
        let ranking: string;

        if (
            idMatch &&
            idMatch[1] &&
            slotMatch &&
            slotMatch[1] &&
            rankingMatch &&
            rankingMatch[1]
        ) {
            id = idMatch[1];
            slot = slotMatch[1];
            ranking = rankingMatch[1];
            steamIds[slot] = {
                id,
                slot,
                ranking,
                time,
            };
        } else {
            let playerArr = row.split(' ');
            slot = playerArr.shift();
            let faction = playerArr.pop();
            let teamSlot = playerArr.pop();
            let profileId = playerArr.pop();
            let name = playerArr.join(' ');
            if (slot && faction && teamSlot && time) {
                players[slot] = {
                    name,
                    slot,
                    teamSlot,
                    profileId,
                    faction,
                    time,
                };
            }
        }
    }

    //combine into one obj
    return Object.keys(players).map((key) => {
        if (steamIds[key]) {
            let p = players[key];
            p.ranking = steamIds[key].ranking;
            p.id = steamIds[key].id;
            return p;
        } else {
            let p = players[key];
            p.ranking = '-1';
            return p;
        }
    });
}
