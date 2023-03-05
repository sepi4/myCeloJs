import { Rank } from "../types";
import { getTotalGames } from "./simpleFunctions";

describe('simpleFunctions', () => {
    let ranks
    test('getTotalGames()', () => {
        ranks = [
            {
                losses: 10,
                wins: 1,
                isModeRanked: 1,
            },
            {
                losses: 20,
                wins: 2,
                isModeRanked: 1,
            },
            {
                losses: 1,
                wins: 1,
                isModeRanked: 0,
            },
        ]
        expect(getTotalGames(ranks as Rank[])).toBe(33)
        ranks = [
            {
                losses: 111,
                wins: 11,
                isModeRanked: 0,
            },
            {
                losses: 111,
                wins: 111,
                isModeRanked: 0,
            },
        ]
        expect(getTotalGames(ranks as Rank[])).toBe(0)
    });
});