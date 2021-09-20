import { Rank } from '../types';

export function ranksArrFilter(
    ranksArr: Rank[],
    tableView: boolean,
    showAll: boolean
) {
    console.log('tableView:', tableView);
    console.log('showAll:', showAll);

    let reg = tableView ? /^Team/ : /^./;
    let rankedOnly = !showAll;
    ranksArr = ranksArr
        .filter((r) => r.name.match(reg))
        .filter((r) => (rankedOnly ? r.rank > 0 : true));
    return ranksArr;
}

type Sorter = {
    name: string;
    fun: (a: Rank, b: Rank) => number;
    reversed: boolean;
};

/**
 * Sorting array of Rank objects for rank list in drop menu
 * @param ranksArr unsorted array
 * @param sorter function for sorting
 * @returns sorted array
 */
export function ranksArrSort(ranksArr: Rank[], sorter: Sorter) {
    const byTotal = (a: Rank, b: Rank) => {
        let aTotal = a.wins + a.losses;
        let bTotal = b.wins + b.losses;
        return bTotal - aTotal;
    };

    if (sorter.name !== 'byRank') {
        return ranksArr.sort(sorter.fun);
    }

    let pos = [];
    let neg = [];
    for (const r of ranksArr) {
        if (r.rank < 0) {
            neg.push(r);
        } else {
            pos.push(r);
        }
    }
    neg = neg.sort(byTotal);

    pos = pos.sort((a, b) => {
        const diff = sorter.fun(a, b);
        if (diff !== 0) {
            return diff;
        }
        return byTotal(a, b);
    });
    return [...pos, ...neg];
}
