import { Rank } from '../types'
import sorters from './sorters'

export function ranksArrFilter(ranksArr: Rank[], tableView: boolean, showAll: boolean): Rank[] {
    const namePattern = tableView ? /^Team/ : /^./
    const rankedOnly = !showAll
    return ranksArr
        .filter((rank) => rank.name.match(namePattern))
        .filter((rank) => (rankedOnly ? rank.rank > 0 : true))
}

type Sorter = {
    name: 'byRank' | 'byWinRate' | 'byStreak' | 'byName' | 'byTotal'
    reversed: boolean
}

function byTotalGames(a: Rank, b: Rank): number {
    return b.wins + b.losses - (a.wins + a.losses)
}

export function ranksArrSort(ranksArr: Rank[], sorter: Sorter): Rank[] {
    const compareFn = sorters[sorter.name]

    if (sorter.name !== 'byRank') {
        return ranksArr.sort(compareFn)
    }

    const ranked: Rank[] = []
    const unranked: Rank[] = []
    for (const rank of ranksArr) {
        if (rank.rank < 0) {
            unranked.push(rank)
        } else {
            ranked.push(rank)
        }
    }

    ranked.sort((a, b) => compareFn(a, b) || byTotalGames(a, b))
    unranked.sort(byTotalGames)

    return [...ranked, ...unranked]
}
